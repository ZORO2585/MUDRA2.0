import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Eye, Square, RotateCcw, Zap } from 'lucide-react';

interface SignDetectionProps {
  onSignDetected: (detectedText: string, confidence: number) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

interface DetectedSign {
  sign: string;
  confidence: number;
  timestamp: number;
}

const SignDetection: React.FC<SignDetectionProps> = ({
  onSignDetected,
  isActive,
  setIsActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedSigns, setDetectedSigns] = useState<DetectedSign[]>([]);
  const [currentSign, setCurrentSign] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [frameCount, setFrameCount] = useState(0);

  // Sign detection mapping (simplified for demo)
  const signMappings: Record<string, string[]> = {
    'hello': ['👋', 'wave', 'greeting'],
    'thank you': ['🙏', 'prayer', 'gratitude'],
    'yes': ['👍', 'thumbs up', 'approval'],
    'no': ['👎', '✋', 'stop', 'denial'],
    'please': ['🤲', 'open hands', 'request'],
    'sorry': ['😔', 'sad face', 'apology'],
    'help': ['🆘', 'assistance', 'support'],
    'water': ['💧', 'drink', 'liquid'],
    'food': ['🍽️', 'eat', 'meal'],
    'good': ['👍', 'positive', 'approval'],
    'bad': ['👎', 'negative', 'disapproval'],
    'happy': ['😊', 'smile', 'joy'],
    'sad': ['😢', 'cry', 'sorrow'],
    'love': ['❤️', 'heart', 'affection'],
    'family': ['👨‍👩‍👧‍👦', 'relatives', 'household'],
    'friend': ['🤝', 'handshake', 'companion'],
    'home': ['🏠', 'house', 'residence'],
    'school': ['🏫', 'education', 'learning'],
    'work': ['💼', 'job', 'employment'],
    'money': ['💰', 'currency', 'payment'],
    'time': ['⏰', 'clock', 'schedule'],
    'today': ['📅', 'current day', 'now'],
    'tomorrow': ['📅', 'next day', 'future'],
    'yesterday': ['📅', 'previous day', 'past']
  };

  // Gesture detection simulation (in real implementation, this would use ML models)
  const detectGesture = useCallback((imageData: ImageData): { sign: string; confidence: number } => {
    // Simulate gesture detection with random results for demo
    const signs = Object.keys(signMappings);
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const confidence = 0.6 + Math.random() * 0.4; // 60-100% confidence
    
    // In real implementation, this would:
    // 1. Use MediaPipe or TensorFlow.js for hand detection
    // 2. Extract hand landmarks
    // 3. Compare with trained sign language models
    // 4. Return detected sign with confidence score
    
    return {
      sign: randomSign,
      confidence: confidence
    };
  }, []);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Detect gesture (simplified simulation)
    if (frameCount % 30 === 0) { // Process every 30 frames (~1 second at 30fps)
      setIsProcessing(true);
      
      setTimeout(() => {
        const detection = detectGesture(imageData);
        
        if (detection.confidence > 0.7) {
          setCurrentSign(detection.sign);
          setConfidence(detection.confidence);
          
          const newDetection: DetectedSign = {
            sign: detection.sign,
            confidence: detection.confidence,
            timestamp: Date.now()
          };
          
          setDetectedSigns(prev => [...prev.slice(-4), newDetection]);
          onSignDetected(detection.sign, detection.confidence);
        }
        
        setIsProcessing(false);
      }, 100);
    }

    setFrameCount(prev => prev + 1);
  }, [isActive, frameCount, detectGesture, onSignDetected]);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsActive(true);
          
          // Start processing frames
          intervalRef.current = setInterval(processFrame, 33); // ~30fps
        };
      }
    } catch (error) {
      setError('Camera access denied or not available');
      console.error('Camera error:', error);
    }
  }, [processFrame, setIsActive]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setFrameCount(0);
  }, [setIsActive]);

  const clearDetections = () => {
    setDetectedSigns([]);
    setCurrentSign('');
    setConfidence(0);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Sign Language Detection
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={clearDetections}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Clear Detections"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={isActive ? stopCamera : startCamera}
            className={`p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isActive ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="relative mb-6">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-0"
          />
          
          {/* Overlay Information */}
          {isActive && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording</span>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute top-4 right-4 bg-purple-500/80 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to start camera</p>
            </div>
          </div>
        )}
      </div>

      {/* Current Detection */}
      {currentSign && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {signMappings[currentSign]?.[0] || '🤟'}
            </div>
            <div className="text-lg font-semibold text-purple-800 mb-1">
              {currentSign.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Recent Detections */}
      {detectedSigns.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Detections:</h3>
          <div className="flex flex-wrap gap-2">
            {detectedSigns.slice(-5).map((detection, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
              >
                <span className="text-lg">{signMappings[detection.sign]?.[0] || '🤟'}</span>
                <span className="text-sm font-medium">{detection.sign}</span>
                <span className="text-xs text-gray-500">
                  {Math.round(detection.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">How to use:</h4>
        <ul className="space-y-1 text-xs">
          <li>• Click the camera button to start detection</li>
          <li>• Position your hands clearly in front of the camera</li>
          <li>• Make clear, deliberate sign gestures</li>
          <li>• The system will detect and convert signs to text</li>
          <li>• Currently supports basic signs (demo version)</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Demo Mode:</strong> This is a simplified demonstration. 
          Full implementation would use advanced ML models like MediaPipe or TensorFlow.js 
          for accurate hand tracking and sign recognition.
        </p>
      </div>
    </div>
  );
};

export default SignDetection;