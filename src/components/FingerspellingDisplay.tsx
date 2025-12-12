import React, { useState, useEffect } from 'react';
import { ASLFingerspelling, HandSign } from './ASLHandSigns';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, SpellCheck as Spell } from 'lucide-react';

interface FingerspellingDisplayProps {
  word: string;
  isActive: boolean;
  onComplete?: () => void;
}

const FingerspellingDisplay: React.FC<FingerspellingDisplayProps> = ({
  word,
  isActive,
  onComplete
}) => {
  const [fingerspelling] = useState(new ASLFingerspelling());
  const [handSigns, setHandSigns] = useState<HandSign[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (word) {
      const signs = fingerspelling.spellWord(word);
      setHandSigns(signs);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  }, [word, fingerspelling]);

  useEffect(() => {
    if (isPlaying && handSigns.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= handSigns.length - 1) {
            setIsPlaying(false);
            onComplete?.();
            return handSigns.length - 1;
          }
          return prevIndex + 1;
        });
      }, 1500 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, handSigns.length, playbackSpeed, onComplete]);

  const handlePlay = () => {
    if (currentIndex >= handSigns.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(handSigns.length - 1, currentIndex + 1));
  };

  if (!isActive || handSigns.length === 0) {
    return null;
  }

  const currentSign = handSigns[currentIndex];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
      <div className="flex items-center justify-center mb-4">
        <Spell className="h-5 w-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-purple-800">
          Fingerspelling: "{word.toUpperCase()}"
        </h3>
      </div>

      {/* Current Hand Sign Display */}
      <div className="text-center mb-6">
        <div className="text-8xl mb-4 animate-pulse">
          {currentSign.emoji}
        </div>
        <div className="bg-white/80 rounded-lg p-4 mb-4">
          <div className="text-3xl font-bold text-purple-800 mb-2">
            {currentSign.letter}
          </div>
          <div className="text-sm text-gray-600">
            {currentSign.description}
          </div>
        </div>
        <div className="text-sm text-purple-600 mb-2">
          Letter {currentIndex + 1} of {handSigns.length}
        </div>
        <div className="h-2 bg-purple-200 rounded-full mb-4">
          <div
            className="h-2 bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / handSigns.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Letter Sequence Preview */}
      <div className="flex flex-wrap justify-center gap-2 p-4 bg-white/60 rounded-lg mb-6 max-h-20 overflow-y-auto">
        {handSigns.map((sign, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`text-2xl p-2 rounded-lg transition-all duration-200 ${
              index === currentIndex
                ? 'bg-purple-500 text-white scale-110 shadow-lg'
                : 'bg-white hover:bg-purple-100 hover:scale-105'
            }`}
            title={`${sign.letter}: ${sign.description}`}
          >
            {sign.emoji}
          </button>
        ))}
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
            title="Restart"
          >
            <RotateCcw className="h-5 w-5 text-purple-600" />
          </button>
          
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Previous Letter"
          >
            <SkipBack className="h-5 w-5 text-purple-600" />
          </button>
          
          <button
            onClick={handlePlay}
            className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === handSigns.length - 1}
            className="p-3 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Next Letter"
          >
            <SkipForward className="h-5 w-5 text-purple-600" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-purple-600">Speed:</span>
          <div className="flex space-x-2">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerspellingDisplay;