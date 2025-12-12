import React, { useState } from 'react';
import { Hand, Type, Zap, RotateCcw } from 'lucide-react';
import SignDetection from './SignDetection';

interface SignToTextConverterProps {
  onTextGenerated: (text: string) => void;
}

const SignToTextConverter: React.FC<SignToTextConverterProps> = ({
  onTextGenerated
}) => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  const [confidence, setConfidence] = useState<number>(0);

  const handleSignDetected = (sign: string, signConfidence: number) => {
    // Add detected sign to current sentence
    const newWords = [...detectedWords, sign];
    setDetectedWords(newWords);
    
    // Create sentence from detected words
    const sentence = newWords.join(' ');
    setCurrentSentence(sentence);
    setConfidence(signConfidence);
    
    // Send to parent component
    onTextGenerated(sentence);
  };

  const clearSentence = () => {
    setDetectedWords([]);
    setCurrentSentence('');
    setConfidence(0);
    onTextGenerated('');
  };

  const removeLastWord = () => {
    const newWords = detectedWords.slice(0, -1);
    setDetectedWords(newWords);
    const sentence = newWords.join(' ');
    setCurrentSentence(sentence);
    onTextGenerated(sentence);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Hand className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Sign to Text</h2>
          <Type className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-gray-600">
          Use your webcam to detect sign language gestures and convert them to text
        </p>
      </div>

      {/* Sign Detection Component */}
      <SignDetection
        onSignDetected={handleSignDetected}
        isActive={isDetectionActive}
        setIsActive={setIsDetectionActive}
      />

      {/* Generated Text Display */}
      {currentSentence && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Generated Text</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={removeLastWord}
                disabled={detectedWords.length === 0}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                title="Remove Last Word"
              >
                Undo
              </button>
              
              <button
                onClick={clearSentence}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                title="Clear All"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Generated Sentence */}
          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <div className="text-xl font-medium text-gray-800 mb-2">
              "{currentSentence}"
            </div>
            <div className="text-sm text-gray-600">
              Words detected: {detectedWords.length} | 
              Average confidence: {Math.round(confidence * 100)}%
            </div>
          </div>

          {/* Word Breakdown */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Detected Words:</div>
            <div className="flex flex-wrap gap-2">
              {detectedWords.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {index + 1}. {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Hand className="h-5 w-5 mr-2 text-purple-600" />
          How Sign-to-Text Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">📹 Camera Detection</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Uses webcam to capture hand gestures</li>
              <li>• Real-time processing of sign movements</li>
              <li>• Supports both static and dynamic signs</li>
              <li>• Works in various lighting conditions</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🧠 AI Processing</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Advanced hand landmark detection</li>
              <li>• Machine learning sign recognition</li>
              <li>• Context-aware word prediction</li>
              <li>• Confidence scoring for accuracy</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">📝 Text Generation</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Converts signs to readable text</li>
              <li>• Builds sentences from detected words</li>
              <li>• Supports editing and corrections</li>
              <li>• Multiple language output support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🎯 Use Cases</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Deaf individuals communicating with hearing people</li>
              <li>• Sign language learning and practice</li>
              <li>• Accessibility in digital interfaces</li>
              <li>• Real-time interpretation services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Supported Signs */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Currently Supported Signs (Demo)
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { sign: '👋', word: 'Hello' },
            { sign: '🙏', word: 'Thank You' },
            { sign: '👍', word: 'Yes' },
            { sign: '👎', word: 'No' },
            { sign: '🤲', word: 'Please' },
            { sign: '😔', word: 'Sorry' },
            { sign: '🆘', word: 'Help' },
            { sign: '💧', word: 'Water' },
            { sign: '🍽️', word: 'Food' },
            { sign: '😊', word: 'Happy' },
            { sign: '😢', word: 'Sad' },
            { sign: '❤️', word: 'Love' },
            { sign: '🏠', word: 'Home' },
            { sign: '🏫', word: 'School' },
            { sign: '💼', word: 'Work' },
            { sign: '👨‍👩‍👧‍👦', word: 'Family' }
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl mb-1">{item.sign}</div>
              <div className="text-xs text-gray-600">{item.word}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          More signs will be added in future updates with advanced ML models
        </div>
      </div>
    </div>
  );
};

export default SignToTextConverter;