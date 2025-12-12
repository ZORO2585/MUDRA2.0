import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Globe } from 'lucide-react';
import { supportedLanguages } from './LanguageSelector';

interface MultilingualSpeechRecognitionProps {
  onTranscript: (transcript: string, language: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  selectedLanguage: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const MultilingualSpeechRecognition: React.FC<MultilingualSpeechRecognitionProps> = ({
  onTranscript,
  isListening,
  setIsListening,
  selectedLanguage,
}) => {
  const [error, setError] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentLang = supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLang.speechCode;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setConfidence(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let maxConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          maxConfidence = Math.max(maxConfidence, event.results[i][0].confidence || 0);
        }
      }
      
      if (finalTranscript) {
        onTranscript(finalTranscript, selectedLanguage);
        setConfidence(maxConfidence);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = `Speech recognition error: ${event.error}`;
      
      // Provide language-specific error messages
      if (event.error === 'language-not-supported') {
        errorMessage = `Language ${currentLang.nativeName} may not be fully supported. Try English for better results.`;
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try speaking again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone access denied or not available.';
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [onTranscript, setIsListening, selectedLanguage, currentLang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [setIsListening]);

  const getInstructions = () => {
    switch (selectedLanguage) {
      case 'hi':
        return isListening ? 'सुन रहा है... रोकने के लिए क्लिक करें' : 'बोलना शुरू करने के लिए क्लिक करें';
      case 'te':
        return isListening ? 'వింటోంది... ఆపడానికి క్లిక్ చేయండి' : 'మాట్లాడటం ప్రారంభించడానికి క్లిక్ చేయండి';
      case 'ta':
        return isListening ? 'கேட்டுக்கொண்டிருக்கிறது... நிறுத்த கிளிக் செய்யுங்கள்' : 'பேசத் தொடங்க கிளிக் செய்யுங்கள்';
      default:
        return isListening ? 'Listening... Click to stop' : 'Click to start speaking';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Language Indicator */}
      <div className="flex items-center space-x-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-blue-800 font-medium">
          {currentLang.flag} {currentLang.nativeName}
        </span>
        <span className="text-blue-600">({currentLang.speechCode})</span>
      </div>

      {/* Main Recording Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg hover:shadow-xl`}
      >
        {isListening ? (
          <Square className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
        {isListening && (
          <div className="absolute -inset-2 rounded-full bg-red-400 opacity-30 animate-ping" />
        )}
      </button>
      
      {/* Instructions */}
      <p className="text-sm text-gray-600 text-center max-w-xs">
        {getInstructions()}
      </p>

      {/* Confidence Score */}
      {confidence !== null && confidence > 0 && (
        <div className="text-xs text-gray-500 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <span className="text-green-600">Confidence: {Math.round(confidence * 100)}%</span>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg max-w-sm border border-red-200">
          <div className="font-medium mb-1">Recognition Error</div>
          <div>{error}</div>
        </div>
      )}

      {/* Language Support Info */}
      <div className="text-xs text-gray-500 text-center max-w-sm">
        <div className="mb-1">
          <strong>Supported:</strong> {supportedLanguages.map(lang => lang.flag).join(' ')}
        </div>
        <div>
          Note: Hindi, Telugu, and Tamil recognition may vary by browser and device.
        </div>
      </div>
    </div>
  );
};

export default MultilingualSpeechRecognition;