import React, { useState } from 'react';
import { Type, Send, Globe } from 'lucide-react';
import { supportedLanguages } from './LanguageSelector';

interface MultilingualTextInputProps {
  onTextSubmit: (text: string, language: string) => void;
  selectedLanguage: string;
}

const MultilingualTextInput: React.FC<MultilingualTextInputProps> = ({ 
  onTextSubmit, 
  selectedLanguage 
}) => {
  const [text, setText] = useState('');
  
  const currentLang = supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text.trim(), selectedLanguage);
      setText('');
    }
  };

  const getPlaceholder = () => {
    switch (selectedLanguage) {
      case 'hi':
        return 'यहाँ अपना संदेश टाइप करें...';
      case 'te':
        return 'మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...';
      case 'ta':
        return 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யுங்கள்...';
      default:
        return 'Type your message here...';
    }
  };

  const getSampleTexts = () => {
    switch (selectedLanguage) {
      case 'hi':
        return [
          'नमस्ते, आप कैसे हैं?',
          'मेरा नाम राम है',
          'धन्यवाद',
          'आपसे मिलकर खुशी हुई',
          'आपका नाम क्या है?',
          'सुप्रभात',
          'मैं खुश हूँ',
          'कृपया मेरी मदद करें',
          'मैं भारत से हूँ',
          'आज मौसम अच्छा है',
          'मुझे खाना पसंद है',
          'मैं स्कूल जाता हूँ',
          'यह मेरा घर है',
          'मैं पानी पीना चाहता हूँ',
          'आज बहुत गर्मी है',
          'मेरे पास एक कार है',
          'मैं फिल्म देखना चाहता हूँ'
        ];
      case 'te':
        return [
          'నమస్కారం, మీరు ఎలా ఉన్నారు?',
          'నా పేరు రాము',
          'ధన్యవాదాలు',
          'మిమ్మల్ని కలవడం ఆనందంగా ఉంది',
          'మీ పేరు ఏమిటి?',
          'శుభోదయం',
          'నేను సంతోషంగా ఉన్నాను',
          'దయచేసి నాకు సహాయం చేయండి',
          'నేను భారతదేశం నుండి వచ్చాను',
          'ఈరోజు వాతావరణం బాగుంది',
          'నాకు తినడం అంటే ఇష్టం',
          'నేను పాఠశాలకు వెళ్తాను',
          'ఇది నా ఇల్లు',
          'నేను నీరు తాగాలని అనుకుంటున్నాను',
          'ఈరోజు చాలా వేడిమిగా ఉంది',
          'నా దగ్గర ఒక కారు ఉంది',
          'నేను సినిమా చూడాలని అనుకుంటున్నాను'
        ];
      case 'ta':
        return [
          'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
          'என் பெயர் ராம்',
          'நன்றி',
          'உங்களை சந்தித்ததில் மகிழ்ச்சி',
          'உங்கள் பெயர் என்ன?',
          'காலை வணக்கம்',
          'நான் மகிழ்ச்சியாக இருக்கிறேன்',
          'தயவுசெய்து எனக்கு உதவுங்கள்',
          'நான் இந்தியாவிலிருந்து வந்தேன்',
          'இன்று வானிலை நன்றாக இருக்கிறது',
          'எனக்கு சாப்பிடுவது பிடிக்கும்',
          'நான் பள்ளிக்கு செல்கிறேன்',
          'இது என் வீடு',
          'நான் தண்ணீர் குடிக்க விரும்புகிறேன்',
          'இன்று மிகவும் வெப்பமாக இருக்கிறது',
          'என்னிடம் ஒரு கார் இருக்கிறது',
          'நான் திரைப்படம் பார்க்க விரும்புகிறேன்'
        ];
      default:
        return [
          'Hello, how are you?',
          'My name is Ram',
          'Thank you',
          'Nice to meet you',
          'What is your name?',
          'Good morning',
          'I am happy',
          'Please help me',
          'I am from India',
          'The weather is nice today',
          'I like to eat food',
          'I go to school',
          'This is my house',
          'I want to drink water',
          'It is very hot today',
          'I have a car',
          'I want to watch a movie'
        ];
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {currentLang.flag} {currentLang.nativeName}
            </span>
          </div>
          <Type className="absolute left-3 top-12 h-5 w-5 text-gray-400" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            dir={selectedLanguage === 'hi' || selectedLanguage === 'te' || selectedLanguage === 'ta' ? 'ltr' : 'ltr'}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="absolute right-2 bottom-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Sample Texts */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <span>Sample phrases in {currentLang.nativeName}:</span>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
          {getSampleTexts().map((sample, index) => (
            <button
              key={index}
              onClick={() => onTextSubmit(sample, selectedLanguage)}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
              dir={selectedLanguage === 'hi' || selectedLanguage === 'te' || selectedLanguage === 'ta' ? 'ltr' : 'ltr'}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultilingualTextInput;