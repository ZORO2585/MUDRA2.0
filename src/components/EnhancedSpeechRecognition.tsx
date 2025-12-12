import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Loader2, Wifi, WifiOff } from 'lucide-react';
import { ApiService } from '../services/ApiService';

interface EnhancedSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  apiService: ApiService;
  useApi: boolean;
}

const EnhancedSpeechRecognition: React.FC<EnhancedSpeechRecognitionProps> = ({
  onTranscript,
  isListening,
  setIsListening,
  apiService,
  useApi,
}) => {
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startApiRecording = useCallback(async () => {
    try {
      setError('');
      setIsProcessing(false);
      const mediaRecorder = await apiService.startRecording();
      
      if (!mediaRecorder) {
        setError('Could not access microphone');
        return;
      }

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      setError('Failed to start recording');
      console.error('Recording error:', error);
    }
  }, [apiService, setIsListening]);

  const stopApiRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    try {
      setIsProcessing(true);
      const audioBlob = await apiService.stopRecording(mediaRecorderRef.current);
      
      const response = await apiService.speechToText(audioBlob);
      
      if (response.success && response.data) {
        onTranscript(response.data.text);
        setConfidence(response.data.confidence);
      } else {
        setError(response.error || 'Failed to process audio');
      }
    } catch (error) {
      setError('Failed to process audio');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
      mediaRecorderRef.current = null;
    }
  }, [apiService, onTranscript, setIsListening]);

  const startBrowserRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          setConfidence(event.results[i][0].confidence);
        }
      }
      
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onTranscript, setIsListening]);

  const stopBrowserRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [setIsListening]);

  const handleToggleRecording = useCallback(() => {
    if (isListening) {
      if (useApi) {
        stopApiRecording();
      } else {
        stopBrowserRecognition();
      }
    } else {
      setConfidence(null);
      if (useApi) {
        startApiRecording();
      } else {
        startBrowserRecognition();
      }
    }
  }, [isListening, useApi, startApiRecording, stopApiRecording, startBrowserRecognition, stopBrowserRecognition]);

  const getButtonColor = () => {
    if (isProcessing) return 'bg-yellow-500 hover:bg-yellow-600';
    if (isListening) return 'bg-red-500 hover:bg-red-600 animate-pulse';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const getButtonIcon = () => {
    if (isProcessing) return <Loader2 className="h-8 w-8 animate-spin" />;
    if (isListening) return <Square className="h-8 w-8" />;
    return <Mic className="h-8 w-8" />;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing audio...';
    if (isListening) return useApi ? 'Recording... Click to stop and process' : 'Listening... Click to stop';
    return 'Click to start speaking';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* API Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        {useApi ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-green-600">API Mode</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Browser Mode</span>
          </>
        )}
      </div>

      {/* Main Recording Button */}
      <button
        onClick={handleToggleRecording}
        disabled={isProcessing}
        className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${getButtonColor()} text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getButtonIcon()}
        {isListening && !isProcessing && (
          <div className="absolute -inset-2 rounded-full bg-red-400 opacity-30 animate-ping" />
        )}
      </button>
      
      {/* Status Text */}
      <p className="text-sm text-gray-600 text-center">
        {getStatusText()}
      </p>

      {/* Confidence Score */}
      {confidence !== null && (
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Confidence: {Math.round(confidence * 100)}%
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg max-w-xs">
          {error}
        </p>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg">
          🔄 Processing with AI...
        </div>
      )}
    </div>
  );
};

export default EnhancedSpeechRecognition;