import React, { useState } from 'react';
import { Hand, Zap, Volume2, BookOpen, FileAudio, Type } from 'lucide-react';
import MultilingualSpeechRecognition from './components/MultilingualSpeechRecognition';
import EnhancedSpeechRecognition from './components/EnhancedSpeechRecognition';
import EmojiDisplay from './components/EmojiDisplay';
import FileUpload from './components/FileUpload';
import MultilingualTextInput from './components/MultilingualTextInput';
import LanguageSelector from './components/LanguageSelector';
import ApiConfig from './components/ApiConfig';
import FingerspellingDisplay from './components/FingerspellingDisplay';
import ASLReference from './components/ASLReference';
import FingerspellingInterface from './components/FingerspellingInterface';
import { TextToGlossConverter } from './components/TextToGloss';
import { EmojiMapper } from './components/EmojiMapper';
import { TranslationService } from './components/TranslationService';
import { ApiService } from './services/ApiService';
import SignToTextConverter from './components/SignToTextConverter';

function App() {
  const [emojis, setEmojis] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [inputLanguage, setInputLanguage] = useState('en');
  const [signLanguage, setSignLanguage] = useState<'ASL' | 'ISL'>('ASL');
  const [currentText, setCurrentText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [currentGloss, setCurrentGloss] = useState('');
  const [apiService] = useState(new ApiService());
  const [translationService] = useState(new TranslationService());
  const [useApi, setUseApi] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [fingerspelledWords, setFingerspelledWords] = useState<string[]>([]);
  const [currentFingerspellingWord, setCurrentFingerspellingWord] = useState('');
  const [showFingerspelling, setShowFingerspelling] = useState(false);
  const [fingerspellingWords, setFingerspellingWords] = useState<string[]>([]);
  const [showFingerspellingInterface, setShowFingerspellingInterface] = useState(false);
  const [activeTab, setActiveTab] = useState<'speech-to-sign' | 'sign-to-text'>('speech-to-sign');
  const [signToTextResult, setSignToTextResult] = useState('');

  const glossConverter = new TextToGlossConverter();
  const emojiMapper = new EmojiMapper();

  const processText = async (text: string, language: string = 'en') => {
    if (!text || text.trim().length === 0) {
      return;
    }
    
    setOriginalText(text);
    setDetectedLanguage(language);
    
    // Translate to English if needed
    let englishText = text;
    let translationResult = null;
    
    if (language !== 'en') {
      translationResult = translationService.translateToEnglish(text, language);
      englishText = translationResult.translatedText;
      
      // If translation confidence is very low, try to process original text
      if (translationResult.confidence < 0.4) {
        console.log('Low confidence translation, using original text as fallback');
      }
    }
    
    setCurrentText(englishText);
    
    let gloss: string;
    
    // Try API-based gloss conversion if available
    if (useApi) {
      try {
        const response = await apiService.textToGloss(englishText);
        if (response.success && response.data) {
          gloss = response.data.gloss;
        } else {
          // Fallback to local conversion
          gloss = glossConverter.convertToGloss(englishText);
        }
      } catch (error) {
        // Fallback to local conversion
        gloss = glossConverter.convertToGloss(englishText);
      }
    } else {
      gloss = glossConverter.convertToGloss(englishText);
    }
    
    setCurrentGloss(gloss);
    
    // Use enhanced mapping with fingerspelling detection
    const { emojis: mappedEmojis, fingerspelledWords: spelledWords, regularWords, fingerspellingWords: detectedFingerspellingWords } = emojiMapper.mapGlossToEmojisWithFingerspelling(gloss, signLanguage);
    
    console.log('Processing result:', {
      originalText: text,
      language,
      englishText,
      gloss,
      mappedEmojis,
      translationConfidence: translationResult?.confidence
    });
    
    setEmojis(mappedEmojis);
    setFingerspelledWords(spelledWords);
    setFingerspellingWords(detectedFingerspellingWords);
    
    // Show fingerspelling interface if there are words to fingerspell
    if (detectedFingerspellingWords.length > 0) {
      setShowFingerspellingInterface(true);
    } else {
      setShowFingerspellingInterface(false);
    }
    
    // If there are words to fingerspell, show the first one
    if (spelledWords.length > 0) {
      setCurrentFingerspellingWord(spelledWords[0]);
      setShowFingerspelling(true);
    } else {
      setShowFingerspelling(false);
    }
    
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleTranscript = (transcript: string, language: string = 'en') => {
    processText(transcript, language);
  };

  const handleSignToText = (generatedText: string) => {
    setSignToTextResult(generatedText);
    // Optionally, you can also process this text through the speech-to-sign pipeline
    // processText(generatedText, 'en');
  };

  const handleTextSubmit = (text: string, language: string = 'en') => {
    processText(text, language);
  };

  const handleFileSelect = (file: File) => {
    // For demo purposes, we'll show a placeholder message
    // In a real implementation, this would use audio processing
    const fileName = file.name;
    processText(`Audio file "${fileName}" uploaded - This is a demo conversion.`);
  };

  const handleApiKeyChange = (apiKey: string, provider: string) => {
    apiService.setApiKey(apiKey, provider);
    setUseApi(!!apiKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Hand className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Mudra</h1>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced Speech-to-Sign Language Converter with AI-powered speech recognition,
            intelligent text-to-gloss conversion, and comprehensive emoji mapping.
          </p>
        </div>

        {/* Controls Row */}
        <div className="mb-8 space-y-6">
          {/* Tab Switcher */}
          <div className="flex justify-center">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/20">
              <button
                onClick={() => setActiveTab('speech-to-sign')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'speech-to-sign'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Volume2 className="h-4 w-4" />
                <span>Speech/Text → Signs</span>
              </button>
              <button
                onClick={() => setActiveTab('sign-to-text')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'sign-to-text'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Hand className="h-4 w-4" />
                <span>Signs → Text</span>
              </button>
            </div>
          </div>

          {/* Controls for Speech-to-Sign mode */}
          {activeTab === 'speech-to-sign' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LanguageSelector 
            selectedLanguage={inputLanguage} 
            onLanguageChange={setInputLanguage}
            type="input"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-sm font-medium text-gray-700">Sign Language:</span>
            <div className="flex bg-gray-200 rounded-lg p-1 w-full max-w-xs">
              <button
                onClick={() => setSignLanguage('ASL')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  signLanguage === 'ASL'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ASL
              </button>
              <button
                onClick={() => setSignLanguage('ISL')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  signLanguage === 'ISL'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ISL
              </button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 hidden lg:block">Tools:</span>
          <ApiConfig onApiKeyChange={handleApiKeyChange} />
          <button
            onClick={() => setShowReference(!showReference)}
            className={`p-3 rounded-lg transition-colors ${
              showReference 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="ASL Reference Guide"
          >
            <BookOpen className="h-5 w-5" />
          </button>
          </div>
        </div>
          )}
        </div>

        {/* ASL Reference Panel */}
        {showReference && (
          <div className="mb-8">
            <ASLReference />
          </div>
        )}

        {/* Main Content Grid */}
        {activeTab === 'speech-to-sign' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Speech Input
              </h2>
              <MultilingualSpeechRecognition
                  onTranscript={handleTranscript}
                  isListening={isListening}
                  setIsListening={setIsListening}
                  selectedLanguage={inputLanguage}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileAudio className="h-5 w-5 mr-2" />Audio Upload
              </h2>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Type className="h-5 w-5 mr-2" />Text Input
              </h2>
              <MultilingualTextInput 
                onTextSubmit={handleTextSubmit} 
                selectedLanguage={inputLanguage}
              />
            </div>

            {/* Processing Information */}
            {(originalText || currentText || currentGloss) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Multilingual Processing Pipeline
                </h3>
                <div className="space-y-3 text-sm">
                  {originalText && detectedLanguage !== 'en' && (
                    <div>
                      <span className="font-medium text-gray-700">Original ({detectedLanguage.toUpperCase()}):</span>
                      <p className="text-gray-600 bg-yellow-50 p-2 rounded mt-1">
                        {originalText}
                      </p>
                    </div>
                  )}
                  {currentText && detectedLanguage !== 'en' && (
                    <div>
                      <span className="font-medium text-gray-700">Translated to English:</span>
                      <p className="text-gray-600 bg-green-50 p-2 rounded mt-1">
                        {currentText}
                      </p>
                    </div>
                  )}
                  {currentText && detectedLanguage === 'en' && (
                    <div>
                      <span className="font-medium text-gray-700">Input Text:</span>
                      <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">
                        {currentText}
                      </p>
                    </div>
                  )}
                  {currentGloss && (
                    <div>
                      <span className="font-medium text-gray-700">Sign Gloss ({signLanguage}):</span>
                      <p className="text-gray-600 bg-blue-50 p-2 rounded mt-1">
                        {currentGloss}
                      </p>
                      {useApi && (
                        <span className="text-xs text-green-600">✨ AI Enhanced</span>
                      )}
                    </div>
                  )}
                  {emojis && emojis.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Generated Signs ({emojis.length}):</span>
                      <p className="text-2xl bg-purple-50 p-2 rounded mt-1">
                        {emojis.join(' ')}
                      </p>
                      <div className="text-xs text-purple-600 mt-1">
                        Regular Signs: {emojis.filter(e => e !== '✋').length} | 
                        Fingerspelling: {emojis.filter(e => e === '✋').length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div>
            {/* Fingerspelling Interface */}
            {showFingerspellingInterface && fingerspellingWords.length > 0 && (
              <div className="mb-6">
                <FingerspellingInterface
                  words={fingerspellingWords}
                  isActive={showFingerspellingInterface}
                  language={signLanguage}
                />
              </div>
            )}

            {/* Fingerspelling Display */}
            {showFingerspelling && currentFingerspellingWord && (
              <div className="mb-6">
                <FingerspellingDisplay
                  word={currentFingerspellingWord}
                  isActive={showFingerspelling}
                  onComplete={() => {
                    // Move to next fingerspelled word if available
                    const currentIndex = fingerspelledWords.indexOf(currentFingerspellingWord);
                    if (currentIndex < fingerspelledWords.length - 1) {
                      setCurrentFingerspellingWord(fingerspelledWords[currentIndex + 1]);
                    } else {
                      setShowFingerspelling(false);
                    }
                  }}
                />
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Hand className="h-5 w-5 mr-2 text-blue-600" />
                Sign Language Output
              </h2>
              <EmojiDisplay
                emojis={emojis}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
              />
            </div>

            {/* Quick Examples */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                Try These Examples ({inputLanguage.toUpperCase()})
              </h3>
              <div className="space-y-2">
                {translationService.getExamplePhrases(inputLanguage).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => processText(example, inputLanguage)}
                    className="block w-full text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                    dir={inputLanguage === 'hi' || inputLanguage === 'te' || inputLanguage === 'ta' ? 'ltr' : 'ltr'}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Sign-to-Text Mode */}
        {activeTab === 'sign-to-text' && (
          <div className="space-y-8">
            <SignToTextConverter onTextGenerated={handleSignToText} />
            
            {/* Show generated text result */}
            {signToTextResult && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Type className="h-5 w-5 mr-2 text-green-600" />
                  Generated Text Output
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <div className="text-xl font-medium text-gray-800 mb-2">
                    "{signToTextResult}"
                  </div>
                  <div className="text-sm text-gray-600">
                    This text was generated from your sign language gestures
                  </div>
                </div>
                
                {/* Option to convert back to signs */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      processText(signToTextResult, 'en');
                      setActiveTab('speech-to-sign');
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Convert Back to Signs</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center bg-white/60 backdrop-blur-sm rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-3">
            Mudra is a complete bidirectional sign language platform supporting multiple Indian languages (English, Hindi, Telugu, Tamil) 
            with emoji signs, ASL fingerspelling, and webcam-based sign detection. Configure API keys for enhanced accuracy.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>🇺🇸 English</span>
            <span>🇮🇳 हिन्दी</span>
            <span>🇮🇳 తెలుగు</span>
            <span>🇮🇳 தமிழ்</span>
          </div>
          <div className="mt-3 flex justify-center space-x-6 text-sm text-gray-500">
            <span>🗣️ Speech → Signs</span>
            <span>📝 Text → Signs</span>
            <span>👋 Signs → Text</span>
            <span>📚 Learning Tools</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;