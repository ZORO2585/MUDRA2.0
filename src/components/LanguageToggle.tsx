import React from 'react';

interface LanguageToggleProps {
  language: 'ASL' | 'ISL';
  setLanguage: (language: 'ASL' | 'ISL') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
      <span className="text-sm font-medium text-gray-700">Sign Language:</span>
      <div className="flex bg-gray-200 rounded-lg p-1">
        <button
          onClick={() => setLanguage('ASL')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'ASL'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ASL
        </button>
        <button
          onClick={() => setLanguage('ISL')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'ISL'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ISL
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;