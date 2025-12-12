import React from 'react';
import { Globe, Volume2, Type } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-US', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  type: 'input' | 'output';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  type
}) => {
  const currentLang = supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-2">
        {type === 'input' ? (
          <>
            <Volume2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Input Language:</span>
          </>
        ) : (
          <>
            <Globe className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Sign Language:</span>
          </>
        )}
      </div>
      
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name} ({language.nativeName})
          </option>
        ))}
      </select>
      
      <div className="mt-1 text-xs text-gray-500">
        {type === 'input' 
          ? `Speech recognition: ${currentLang.speechCode}`
          : `Output: ${type === 'output' ? 'ASL/ISL' : 'Sign Language'}`
        }
      </div>
    </div>
  );
};

export default LanguageSelector;