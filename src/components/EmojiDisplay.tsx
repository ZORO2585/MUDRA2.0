import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface EmojiDisplayProps {
  emojis: string[];
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const EmojiDisplay: React.FC<EmojiDisplayProps> = ({
  emojis,
  isPlaying,
  setIsPlaying,
  currentIndex,
  setCurrentIndex,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  useEffect(() => {
    if (isPlaying && emojis.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= emojis.length - 1) {
            setIsPlaying(false);
            return emojis.length - 1;
          }
          return prevIndex + 1;
        });
      }, 1000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, emojis.length, playbackSpeed, setCurrentIndex, setIsPlaying]);

  const handlePlay = () => {
    if (currentIndex >= emojis.length - 1) {
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
    setCurrentIndex(Math.min(emojis.length - 1, currentIndex + 1));
  };

  if (emojis.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🤟</div>
        <p className="text-gray-600">Speak or type something to see sign language emojis</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
      {/* Main emoji display */}
      <div className="text-center">
        <div className="text-8xl md:text-9xl mb-4 animate-bounce">
          {emojis[currentIndex]}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {currentIndex + 1} of {emojis.length}
        </div>
        <div className="h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / emojis.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Emoji sequence preview */}
      <div className="flex flex-wrap justify-center gap-2 p-4 bg-gray-50 rounded-lg max-h-24 overflow-y-auto">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`text-2xl p-2 rounded-lg transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-500 text-white scale-110 shadow-lg'
                : 'bg-white hover:bg-gray-100 hover:scale-105'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Restart"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Previous"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          
          <button
            onClick={handlePlay}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === emojis.length - 1}
            className="p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Next"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-600">Speed:</span>
          <div className="flex space-x-2">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
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

export default EmojiDisplay;