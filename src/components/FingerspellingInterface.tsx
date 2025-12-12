import React, { useState, useEffect } from 'react';
import { ASLFingerspelling, HandSign } from './ASLHandSigns';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Hand, Hash, Type } from 'lucide-react';

interface FingerspellingInterfaceProps {
  words: string[];
  isActive: boolean;
  language: 'ASL' | 'ISL';
}

const FingerspellingInterface: React.FC<FingerspellingInterfaceProps> = ({
  words,
  isActive,
  language
}) => {
  const [fingerspelling] = useState(new ASLFingerspelling());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [allHandSigns, setAllHandSigns] = useState<HandSign[][]>([]);

  useEffect(() => {
    if (words.length > 0) {
      const signsArray = words.map(word => fingerspelling.spellWord(word));
      setAllHandSigns(signsArray);
      setCurrentWordIndex(0);
      setCurrentLetterIndex(0);
      setIsPlaying(false);
    }
  }, [words, fingerspelling]);

  useEffect(() => {
    if (isPlaying && allHandSigns.length > 0) {
      const interval = setInterval(() => {
        setCurrentLetterIndex(prevLetterIndex => {
          const currentWordSigns = allHandSigns[currentWordIndex];
          
          if (prevLetterIndex >= currentWordSigns.length - 1) {
            // Move to next word
            if (currentWordIndex < allHandSigns.length - 1) {
              setCurrentWordIndex(prev => prev + 1);
              return 0;
            } else {
              // End of all words
              setIsPlaying(false);
              return prevLetterIndex;
            }
          }
          return prevLetterIndex + 1;
        });
      }, 1500 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, allHandSigns, currentWordIndex, playbackSpeed]);

  const handlePlay = () => {
    if (currentWordIndex >= allHandSigns.length - 1 && 
        currentLetterIndex >= allHandSigns[currentWordIndex]?.length - 1) {
      setCurrentWordIndex(0);
      setCurrentLetterIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
    } else if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setCurrentLetterIndex(allHandSigns[currentWordIndex - 1]?.length - 1 || 0);
    }
  };

  const handleNext = () => {
    const currentWordSigns = allHandSigns[currentWordIndex];
    if (currentLetterIndex < currentWordSigns.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    } else if (currentWordIndex < allHandSigns.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setCurrentLetterIndex(0);
    }
  };

  const handleWordClick = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);
    setCurrentLetterIndex(0);
    setIsPlaying(false);
  };

  const handleLetterClick = (letterIndex: number) => {
    setCurrentLetterIndex(letterIndex);
    setIsPlaying(false);
  };

  if (!isActive || allHandSigns.length === 0) {
    return null;
  }

  const currentWord = words[currentWordIndex];
  const currentWordSigns = allHandSigns[currentWordIndex];
  const currentSign = currentWordSigns[currentLetterIndex];

  const getTotalLetters = () => {
    return allHandSigns.reduce((total, wordSigns) => total + wordSigns.length, 0);
  };

  const getCurrentPosition = () => {
    let position = 0;
    for (let i = 0; i < currentWordIndex; i++) {
      position += allHandSigns[i].length;
    }
    return position + currentLetterIndex + 1;
  };

  const isNumber = (char: string) => /\d/.test(char);
  const isLetter = (char: string) => /[A-Za-z]/.test(char);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
      <div className="flex items-center justify-center mb-6">
        <Hand className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-green-800">
          {language} Hand Signs & Fingerspelling
        </h2>
      </div>

      {/* Current Hand Sign Display */}
      <div className="text-center mb-6">
        <div className="bg-white/80 rounded-xl p-6 mb-4 shadow-inner">
          <div className="text-9xl mb-4 animate-pulse">
            {currentSign.emoji}
          </div>
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {isNumber(currentSign.letter) ? (
                <Hash className="h-5 w-5 text-green-600" />
              ) : (
                <Type className="h-5 w-5 text-green-600" />
              )}
              <div className="text-4xl font-bold text-green-800">
                {currentSign.letter}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {currentSign.description}
            </div>
            <div className="text-xs text-green-600 font-medium">
              {currentSign.handShape}
            </div>
          </div>
        </div>

        {/* Progress Information */}
        <div className="space-y-2 mb-4">
          <div className="text-sm text-green-700">
            <span className="font-semibold">Word:</span> "{currentWord.toUpperCase()}" 
            <span className="mx-2">•</span>
            <span className="font-semibold">Letter:</span> {currentLetterIndex + 1} of {currentWordSigns.length}
          </div>
          <div className="text-xs text-gray-600">
            Overall Progress: {getCurrentPosition()} of {getTotalLetters()} signs
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-green-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(getCurrentPosition() / getTotalLetters()) * 100}%` }}
          />
        </div>
      </div>

      {/* Words Navigation */}
      <div className="mb-6">
        <div className="text-sm font-medium text-green-700 mb-3">Words to Fingerspell:</div>
        <div className="flex flex-wrap justify-center gap-2">
          {words.map((word, wordIndex) => (
            <button
              key={wordIndex}
              onClick={() => handleWordClick(wordIndex)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                wordIndex === currentWordIndex
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-green-100 text-green-700 hover:scale-105'
              }`}
            >
              {word.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Current Word Letters */}
      <div className="mb-6">
        <div className="text-sm font-medium text-green-700 mb-3">
          Letters in "{currentWord.toUpperCase()}":
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-4 bg-white/60 rounded-lg max-h-32 overflow-y-auto">
          {currentWordSigns.map((sign, letterIndex) => (
            <button
              key={letterIndex}
              onClick={() => handleLetterClick(letterIndex)}
              className={`relative text-2xl p-3 rounded-lg transition-all duration-200 ${
                letterIndex === currentLetterIndex
                  ? 'bg-green-500 text-white scale-110 shadow-lg'
                  : 'bg-white hover:bg-green-100 hover:scale-105'
              }`}
              title={`${sign.letter}: ${sign.description}`}
            >
              {sign.emoji}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                letterIndex === currentLetterIndex ? 'bg-white text-green-500' : 'bg-green-500 text-white'
              }`}>
                {letterIndex + 1}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            title="Restart All"
          >
            <RotateCcw className="h-5 w-5 text-green-600" />
          </button>
          
          <button
            onClick={handlePrevious}
            disabled={currentWordIndex === 0 && currentLetterIndex === 0}
            className="p-3 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Previous Sign"
          >
            <SkipBack className="h-5 w-5 text-green-600" />
          </button>
          
          <button
            onClick={handlePlay}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
            title={isPlaying ? 'Pause' : 'Play All'}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentWordIndex === allHandSigns.length - 1 && 
                     currentLetterIndex === currentWordSigns.length - 1}
            className="p-3 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Next Sign"
          >
            <SkipForward className="h-5 w-5 text-green-600" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-green-600 font-medium">Speed:</span>
          <div className="flex space-x-2">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-green-100 hover:bg-green-200 text-green-600'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-green-200">
        <div className="flex justify-center space-x-8 text-sm text-green-600">
          <div className="text-center">
            <div className="font-semibold text-lg">{words.length}</div>
            <div>Words</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{getTotalLetters()}</div>
            <div>Signs</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {Math.round((getCurrentPosition() / getTotalLetters()) * 100)}%
            </div>
            <div>Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerspellingInterface;