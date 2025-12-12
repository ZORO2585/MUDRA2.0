// Translation service for converting between languages
export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export class TranslationService {
  // Basic translation mappings for common phrases
  private translations: Record<string, Record<string, string>> = {
    // English to other languages
    'en': {
      'hello': { hi: 'नमस्ते', te: 'నమస్కారం', ta: 'வணக்கம்' },
      'hi': { hi: 'हाय', te: 'హాయ్', ta: 'ஹாய்' },
      'thank you': { hi: 'धन्यवाद', te: 'ధన్యవాదాలు', ta: 'நன்றி' },
      'thanks': { hi: 'धन्यवाद', te: 'ధన్యవాదాలు', ta: 'நன்றி' },
      'good morning': { hi: 'सुप्रभात', te: 'శుభోదయం', ta: 'காலை வணக்கம்' },
      'how are you': { hi: 'आप कैसे हैं', te: 'మీరు ఎలా ఉన్నారు', ta: 'நீங்கள் எப்படி இருக்கிறீர்கள்' },
      'my name is': { hi: 'मेरा नाम है', te: 'నా పేరు', ta: 'என் பெயர்' },
      'nice to meet you': { hi: 'आपसे मिलकर खुशी हुई', te: 'మిమ్మల్ని కలవడం ఆనందంగా ఉంది', ta: 'உங்களை சந்தித்ததில் மகிழ்ச்சி' },
      'please': { hi: 'कृपया', te: 'దయచేసి', ta: 'தயவுசெய்து' },
      'sorry': { hi: 'माफ़ करें', te: 'క్షమించండి', ta: 'மன்னிக்கவும்' },
      'yes': { hi: 'हाँ', te: 'అవును', ta: 'ஆம்' },
      'no': { hi: 'नहीं', te: 'లేదు', ta: 'இல்லை' },
      'help': { hi: 'मदद', te: 'సహాయం', ta: 'உதவி' },
      'water': { hi: 'पानी', te: 'నీరు', ta: 'தண்ணீர்' },
      'food': { hi: 'खाना', te: 'ఆహారం', ta: 'உணவு' },
      'family': { hi: 'परिवार', te: 'కుటుంబం', ta: 'குடும்பம்' },
      'friend': { hi: 'दोस्त', te: 'స్నేహితుడు', ta: 'நண்பர்' },
      'love': { hi: 'प्यार', te: 'ప్రేమ', ta: 'காதல்' },
      'happy': { hi: 'खुश', te: 'సంతోషం', ta: 'மகிழ்ச்சி' },
      'sad': { hi: 'उदास', te: 'దుఃఖం', ta: 'சோகம்' },
      'good': { hi: 'अच्छा', te: 'మంచి', ta: 'நல்ல' },
      'bad': { hi: 'बुरा', te: 'చెడు', ta: 'கெட்ட' },
      'big': { hi: 'बड़ा', te: 'పెద్ద', ta: 'பெரிய' },
      'small': { hi: 'छोटा', te: 'చిన్న', ta: 'சிறிய' },
      'hot': { hi: 'गर्म', te: 'వేడిమి', ta: 'சூடான' },
      'cold': { hi: 'ठंडा', te: 'చల్లని', ta: 'குளிர்ந்த' },
      'mother': { hi: 'माँ', te: 'అమ్మ', ta: 'அம்மா' },
      'father': { hi: 'पिता', te: 'నాన్న', ta: 'அப்பா' },
      'brother': { hi: 'भाई', te: 'అన్న', ta: 'அண்ணா' },
      'sister': { hi: 'बहन', te: 'అక్క', ta: 'அக்கா' },
      'home': { hi: 'घर', te: 'ఇల్లు', ta: 'வீடு' },
      'school': { hi: 'स्कूल', te: 'పాఠశాల', ta: 'பள்ளி' },
      'work': { hi: 'काम', te: 'పని', ta: 'வேலை' },
      'money': { hi: 'पैसा', te: 'డబ్బు', ta: 'பணம்' },
      'time': { hi: 'समय', te: 'సమయం', ta: 'நேரம்' },
      'today': { hi: 'आज', te: 'ఈరోజు', ta: 'இன்று' },
      'tomorrow': { hi: 'कल', te: 'రేపు', ta: 'நாளை' },
      'yesterday': { hi: 'कल', te: 'నిన్న', ta: 'நேற்று' },
      'eat': { hi: 'खाना', te: 'తినడం', ta: 'சாப்பிடு' },
      'drink': { hi: 'पीना', te: 'తాగడం', ta: 'குடி' },
      'go': { hi: 'जाना', te: 'వెళ్ళడం', ta: 'போ' },
      'come': { hi: 'आना', te: 'రావడం', ta: 'வா' },
      'see': { hi: 'देखना', te: 'చూడడం', ta: 'பார்' },
      'hear': { hi: 'सुनना', te: 'వినడం', ta: 'கேள்' },
      'speak': { hi: 'बोलना', te: 'మాట్లాడడం', ta: 'பேசு' },
      'understand': { hi: 'समझना', te: 'అర్థం చేసుకోవడం', ta: 'புரிந்துகொள்' },
      'know': { hi: 'जानना', te: 'తెలుసు', ta: 'தெரியும்' },
      'want': { hi: 'चाहना', te: 'కావాలి', ta: 'வேண்டும்' },
      'need': { hi: 'जरूरत', te: 'అవసరం', ta: 'தேவை' },
      'like': { hi: 'पसंद', te: 'ఇష్టం', ta: 'பிடிக்கும்' },
      
      // Extended vocabulary for comprehensive coverage
      'what': { hi: 'क्या', te: 'ఏమిటి', ta: 'என்ன' },
      'who': { hi: 'कौन', te: 'ఎవరు', ta: 'யார்' },
      'where': { hi: 'कहाँ', te: 'ఎక్కడ', ta: 'எங்கே' },
      'when': { hi: 'कब', te: 'ఎప్పుడు', ta: 'எப்போது' },
      'why': { hi: 'क्यों', te: 'ఎందుకు', ta: 'ஏன்' },
      'how': { hi: 'कैसे', te: 'ఎలా', ta: 'எப்படி' },
      'how much': { hi: 'कितना', te: 'ఎంత', ta: 'எவ்வளவு' },
      'i': { hi: 'मैं', te: 'నేను', ta: 'நான்' },
      'you': { hi: 'तुम', te: 'నువ్వు', ta: 'நீ' },
      'he': { hi: 'वह', te: 'అతను', ta: 'அவன்' },
      'she': { hi: 'वह', te: 'ఆమె', ta: 'அவள்' },
      'we': { hi: 'हम', te: 'మేము', ta: 'நாங்கள்' },
      'they': { hi: 'वे', te: 'వారు', ta: 'அவர்கள்' },
      'this': { hi: 'यह', te: 'ఇది', ta: 'இது' },
      'that': { hi: 'वह', te: 'అది', ta: 'அது' },
      'here': { hi: 'यहाँ', te: 'ఇక్కడ', ta: 'இங்கே' },
      'there': { hi: 'वहाँ', te: 'అక్కడ', ta: 'அங்கே' },
      'now': { hi: 'अब', te: 'ఇప్పుడు', ta: 'இப்போது' },
      'then': { hi: 'तब', te: 'అప్పుడు', ta: 'அப்போது' },
      'before': { hi: 'पहले', te: 'ముందు', ta: 'முன்பு' },
      'after': { hi: 'बाद में', te: 'తర్వాత', ta: 'பிறகு' },
      'morning': { hi: 'सुबह', te: 'ఉదయం', ta: 'காலை' },
      'afternoon': { hi: 'दोपहर', te: 'మధ్యాహ్నం', ta: 'மதியம்' },
      'evening': { hi: 'शाम', te: 'సాయంత్రం', ta: 'மாலை' },
      'night': { hi: 'रात', te: 'రాత్రి', ta: 'இரவு' },
      'day': { hi: 'दिन', te: 'రోజు', ta: 'நாள்' },
      'week': { hi: 'सप्ताह', te: 'వారం', ta: 'வாரம்' },
      'month': { hi: 'महीना', te: 'నెల', ta: 'மாதம்' },
      'year': { hi: 'साल', te: 'సంవత్సరం', ta: 'வருடம்' },
      'house': { hi: 'घर', te: 'ఇల్లు', ta: 'வீடு' },
      'car': { hi: 'गाड़ी', te: 'కారు', ta: 'கார்' },
      'bus': { hi: 'बस', te: 'బస్సు', ta: 'பஸ்' },
      'train': { hi: 'ट्रेन', te: 'రైలు', ta: 'ரயில்' },
      'plane': { hi: 'हवाई जहाज़', te: 'విమానం', ta: 'விமானம்' },
      'book': { hi: 'किताब', te: 'పుస్తకం', ta: 'புத்தகம்' },
      'pen': { hi: 'कलम', te: 'పెన్', ta: 'பேனா' },
      'paper': { hi: 'कागज़', te: 'కాగితం', ta: 'காகிதம்' },
      'phone': { hi: 'फ़ोन', te: 'ఫోన్', ta: 'போன்' },
      'computer': { hi: 'कंप्यूटर', te: 'కంప్యూటర్', ta: 'கணினி' },
      'television': { hi: 'टेलीविज़न', te: 'టెలివిజన్', ta: 'தொலைக்காட்சி' },
      'music': { hi: 'संगीत', te: 'సంగీతం', ta: 'இசை' },
      'song': { hi: 'गाना', te: 'పాట', ta: 'பாட்டு' },
      'dance': { hi: 'नाच', te: 'నృత్యం', ta: 'நடனம்' },
      'game': { hi: 'खेल', te: 'ఆట', ta: 'விளையாட்டு' },
      'sport': { hi: 'खेल', te: 'క్రీడ', ta: 'விளையாட்டு' },
      'cricket': { hi: 'क्रिकेट', te: 'క్రికెట్', ta: 'கிரிக்கெட்' },
      'football': { hi: 'फुटबॉल', te: 'ఫుట్‌బాల్', ta: 'கால்பந்து' },
      'doctor': { hi: 'डॉक्टर', te: 'డాక్టర్', ta: 'மருத்துவர்' },
      'teacher': { hi: 'शिक्षक', te: 'ఉపాధ్యాయుడు', ta: 'ஆசிரியர்' },
      'student': { hi: 'छात्र', te: 'విద్యార్థి', ta: 'மாணவர்' },
      'engineer': { hi: 'इंजीनियर', te: 'ఇంజనీర్', ta: 'பொறியாளர்' },
      'lawyer': { hi: 'वकील', te: 'న్యాయవాది', ta: 'வழக்கறிஞர்' },
      'police': { hi: 'पुलिस', te: 'పోలీసు', ta: 'காவல்துறை' },
      'soldier': { hi: 'सैनिक', te: 'సైనికుడు', ta: 'சிப்பாய்' },
      'farmer': { hi: 'किसान', te: 'రైతు', ta: 'விவசாயி' },
      'shop': { hi: 'दुकान', te: 'దుకాణం', ta: 'கடை' },
      'market': { hi: 'बाज़ार', te: 'మార్కెట్', ta: 'சந்தை' },
      'hospital': { hi: 'अस्पताल', te: 'ఆసుపత్రి', ta: 'மருத்துவமனை' },
      'office': { hi: 'दफ्तर', te: 'కార్యాలయం', ta: 'அலுவலகம்' },
      'bank': { hi: 'बैंक', te: 'బ్యాంకు', ta: 'வங்கி' },
      'restaurant': { hi: 'रेस्टोरेंट', te: 'రెస్టారెంట్', ta: 'உணவகம்' },
      'hotel': { hi: 'होटल', te: 'హోటల్', ta: 'ஹோட்டல்' },
      'temple': { hi: 'मंदिर', te: 'గుడి', ta: 'கோயில்' },
      'mosque': { hi: 'मस्जिद', te: 'మసీదు', ta: 'மசூதி' },
      'church': { hi: 'गिरजा', te: 'చర్చి', ta: 'தேவாலயம்' },
      'festival': { hi: 'त्योहार', te: 'పండుగ', ta: 'திருவிழா' },
      'birthday': { hi: 'जन्मदिन', te: 'జన్మదినం', ta: 'பிறந்தநாள்' },
      'wedding': { hi: 'शादी', te: 'పెళ్లి', ta: 'திருமணம்' },
      'party': { hi: 'पार्टी', te: 'పార్టీ', ta: 'விழா' },
      'gift': { hi: 'उपहार', te: 'బహుమతి', ta: 'பரிசு' },
      'flower': { hi: 'फूल', te: 'పువ్వు', ta: 'பூ' },
      'tree': { hi: 'पेड़', te: 'చెట్టు', ta: 'மரம்' },
      'river': { hi: 'नदी', te: 'నది', ta: 'ஆறு' },
      'mountain': { hi: 'पहाड़', te: 'కొండ', ta: 'மலை' },
      'sea': { hi: 'समुद्र', te: 'సముద్రం', ta: 'கடல்' },
      'sun': { hi: 'सूरज', te: 'సూర్యుడు', ta: 'சூரியன்' },
      'moon': { hi: 'चाँद', te: 'చంద్రుడు', ta: 'சந்திரன்' },
      'star': { hi: 'तारा', te: 'నక్షత్రం', ta: 'நட்சத்திரம்' },
      'rain': { hi: 'बारिश', te: 'వర్షం', ta: 'மழை' },
      'wind': { hi: 'हवा', te: 'గాలి', ta: 'காற்று' },
      'fire': { hi: 'आग', te: 'అగ్ని', ta: 'நெருப்பு' },
      'earth': { hi: 'पृथ्वी', te: 'భూమి', ta: 'பூமி' },
      'sky': { hi: 'आकाश', te: 'ఆకాశం', ta: 'வானம்' },
      'color': { hi: 'रंग', te: 'రంగు', ta: 'நிறம்' },
      'red': { hi: 'लाल', te: 'ఎరుపు', ta: 'சிவப்பு' },
      'blue': { hi: 'नीला', te: 'నీలం', ta: 'நீலம்' },
      'green': { hi: 'हरा', te: 'ఆకుపచ్చ', ta: 'பச்சை' },
      'yellow': { hi: 'पीला', te: 'పసుపు', ta: 'மஞ்சள்' },
      'white': { hi: 'सफ़ेद', te: 'తెలుపు', ta: 'வெள்ளை' },
      'black': { hi: 'काला', te: 'నలుపు', ta: 'கருப்பு' },
      'orange': { hi: 'नारंगी', te: 'నారింజ', ta: 'ஆரஞ்சு' },
      'purple': { hi: 'बैंगनी', te: 'ఊదా', ta: 'ஊதா' },
      'pink': { hi: 'गुलाबी', te: 'గులాబీ', ta: 'இளஞ்சிவப்பு' },
      'brown': { hi: 'भूरा', te: 'గోధుమ', ta: 'பழுப்பு' },
      'one': { hi: 'एक', te: 'ఒకటి', ta: 'ஒன்று' },
      'two': { hi: 'दो', te: 'రెండు', ta: 'இரண்டு' },
      'three': { hi: 'तीन', te: 'మూడు', ta: 'மூன்று' },
      'four': { hi: 'चार', te: 'నాలుగు', ta: 'நான்கு' },
      'five': { hi: 'पाँच', te: 'ఐదు', ta: 'ஐந்து' },
      'six': { hi: 'छह', te: 'ఆరు', ta: 'ஆறு' },
      'seven': { hi: 'सात', te: 'ఏడు', ta: 'ஏழு' },
      'eight': { hi: 'आठ', te: 'ఎనిమిది', ta: 'எட்டு' },
      'nine': { hi: 'नौ', te: 'తొమ్మిది', ta: 'ஒன்பது' },
      'ten': { hi: 'दस', te: 'పది', ta: 'பத்து' },
      'hundred': { hi: 'सौ', te: 'వంద', ta: 'நூறு' },
      'thousand': { hi: 'हज़ार', te: 'వేయి', ta: 'ஆயிரம்' },
      'first': { hi: 'पहला', te: 'మొదటి', ta: 'முதல்' },
      'second': { hi: 'दूसरा', te: 'రెండవ', ta: 'இரண்டாவது' },
      'third': { hi: 'तीसरा', te: 'మూడవ', ta: 'மூன்றாவது' },
      'last': { hi: 'अंतिम', te: 'చివరి', ta: 'கடைசி' },
      'new': { hi: 'नया', te: 'కొత్త', ta: 'புதிய' },
      'old': { hi: 'पुराना', te: 'పాత', ta: 'பழைய' },
      'young': { hi: 'जवान', te: 'యువ', ta: 'இளம்' },
      'beautiful': { hi: 'सुंदर', te: 'అందమైన', ta: 'அழகான' },
      'ugly': { hi: 'बदसूरत', te: 'వికారమైన', ta: 'அசிங்கமான' },
      'clean': { hi: 'साफ़', te: 'శుభ్రమైన', ta: 'சுத்தமான' },
      'dirty': { hi: 'गंदा', te: 'మురికిగా', ta: 'அழுக்கான' },
      'fast': { hi: 'तेज़', te: 'వేగంగా', ta: 'வேகமான' },
      'slow': { hi: 'धीमा', te: 'నెమ్మదిగా', ta: 'மெதுவான' },
      'strong': { hi: 'मज़बूत', te: 'బలమైన', ta: 'வலிமையான' },
      'weak': { hi: 'कमज़ोर', te: 'బలహీనమైన', ta: 'பலவீனமான' },
      'rich': { hi: 'अमीर', te: 'ధనవంతుడు', ta: 'பணக்காரன்' },
      'poor': { hi: 'गरीब', te: 'పేదవాడు', ta: 'ஏழை' },
      'expensive': { hi: 'महंगा', te: 'ఖరీదైన', ta: 'விலையுயர்ந்த' },
      'cheap': { hi: 'सस्ता', te: 'చౌకైన', ta: 'மலிவான' },
      'free': { hi: 'मुफ़्त', te: 'ఉచిత', ta: 'இலவச' },
      'busy': { hi: 'व्यस्त', te: 'బిజీగా', ta: 'பிஸியான' },
      'tired': { hi: 'थका हुआ', te: 'అలసిపోయిన', ta: 'சோர்வான' },
      'hungry': { hi: 'भूखा', te: 'ఆకలిగా', ta: 'பசியான' },
      'thirsty': { hi: 'प्यासा', te: 'దాహంతో', ta: 'தாகமான' },
      'sick': { hi: 'बीमार', te: 'అనారోగ్యంతో', ta: 'நோயுற்ற' },
      'healthy': { hi: 'स्वस्थ', te: 'ఆరోగ్యంగా', ta: 'ஆரோக்கியமான' },
      'angry': { hi: 'गुस्सा', te: 'కోపంగా', ta: 'கோபமான' },
      'calm': { hi: 'शांत', te: 'ప్రశాంతంగా', ta: 'அமைதியான' },
      'excited': { hi: 'उत्साहित', te: 'ఉత్సాహంగా', ta: 'உற்சாகமான' },
      'worried': { hi: 'चिंतित', te: 'ఆందోళనతో', ta: 'கவலையான' },
      'surprised': { hi: 'हैरान', te: 'ఆశ్చర్యంగా', ta: 'ஆச்சரியமான' },
      'confused': { hi: 'भ्रमित', te: 'గందరగోళంగా', ta: 'குழப்பமான' },
      'proud': { hi: 'गर्व', te: 'గర్వంగా', ta: 'பெருமையான' },
      'ashamed': { hi: 'शर्मिंदा', te: 'సిగ్గుపడుతున్న', ta: 'வெட்கமான' },
      'brave': { hi: 'बहादुर', te: 'ధైర్యవంతుడు', ta: 'தைரியமான' },
      'afraid': { hi: 'डरा हुआ', te: 'భయపడుతున్న', ta: 'பயமான' },
      'careful': { hi: 'सावधान', te: 'జాగ్రత్తగా', ta: 'கவனமான' },
      'careless': { hi: 'लापरवाह', te: 'అజాగ్రత్తగా', ta: 'கவனமில்லாத' },
      'honest': { hi: 'ईमानदार', te: 'నిజాయితీగా', ta: 'நேர்மையான' },
      'dishonest': { hi: 'बेईमान', te: 'నిజాయితీ లేని', ta: 'நேர்மையற்ற' },
      'kind': { hi: 'दयालु', te: 'దయగల', ta: 'கருணையான' },
      'cruel': { hi: 'क्रूर', te: 'క్రూరమైన', ta: 'கொடூரமான' },
      'polite': { hi: 'विनम्र', te: 'మర్యాదగా', ta: 'மரியாதையான' },
      'rude': { hi: 'अशिष्ट', te: 'మర్యాద లేని', ta: 'முரட்டுத்தனமான' },
      'smart': { hi: 'चतुर', te: 'తెలివైన', ta: 'புத்திசாலியான' },
      'stupid': { hi: 'मूर्ख', te: 'మూర్ఖుడు', ta: 'முட்டாள்' },
      'funny': { hi: 'मज़ेदार', te: 'హాస్యాస్పదమైన', ta: 'வேடிக்கையான' },
      'serious': { hi: 'गंभीर', te: 'గంభీరమైన', ta: 'தீவிரமான' },
      'quiet': { hi: 'शांत', te: 'నిశ్శబ్దంగా', ta: 'அமைதியான' },
      'loud': { hi: 'शोर', te: 'బిగ్గరగా', ta: 'சத்தமான' },
      'easy': { hi: 'आसान', te: 'సులభమైన', ta: 'எளிதான' },
      'difficult': { hi: 'कठिन', te: 'కష్టమైన', ta: 'கடினமான' },
      'possible': { hi: 'संभव', te: 'సాధ్యమైన', ta: 'சாத்தியமான' },
      'impossible': { hi: 'असंभव', te: 'అసాధ్యమైన', ta: 'சாத்தியமற்ற' },
      'important': { hi: 'महत्वपूर्ण', te: 'ముఖ్యమైన', ta: 'முக்கியமான' },
      'unimportant': { hi: 'अनावश्यक', te: 'అనవసరమైన', ta: 'முக்கியமற்ற' },
      'interesting': { hi: 'दिलचस्प', te: 'ఆసక్తికరమైన', ta: 'சுவாரஸ்யமான' },
      'boring': { hi: 'उबाऊ', te: 'బోరింగ్', ta: 'சலிப்பான' },
      'useful': { hi: 'उपयोगी', te: 'ఉపయోగకరమైన', ta: 'பயனுள்ள' },
      'useless': { hi: 'बेकार', te: 'పనికిరాని', ta: 'பயனற்ற' },
      'correct': { hi: 'सही', te: 'సరైన', ta: 'சரியான' },
      'wrong': { hi: 'गलत', te: 'తప్పు', ta: 'தவறான' },
      'true': { hi: 'सच', te: 'నిజమైన', ta: 'உண்மையான' },
      'false': { hi: 'झूठ', te: 'అబద్ధమైన', ta: 'பொய்யான' },
      'real': { hi: 'वास्तविक', te: 'నిజమైన', ta: 'உண்மையான' },
      'fake': { hi: 'नकली', te: 'నకిలీ', ta: 'போலியான' }
    }
  };

  // Reverse translations (from other languages to English)
  private reverseTranslations: Record<string, Record<string, string>> = {};

  constructor() {
    this.buildReverseTranslations();
  }

  private buildReverseTranslations() {
    const languages = ['hi', 'te', 'ta'];
    
    languages.forEach(lang => {
      this.reverseTranslations[lang] = {};
      
      Object.entries(this.translations.en).forEach(([englishPhrase, translations]) => {
        const translatedPhrase = translations[lang as keyof typeof translations];
        if (translatedPhrase) {
          this.reverseTranslations[lang][translatedPhrase.toLowerCase()] = englishPhrase;
        }
      });
    });
  }

  // Translate text to English for processing
  translateToEnglish(text: string, sourceLanguage: string): TranslationResult {
    if (sourceLanguage === 'en') {
      return {
        translatedText: text,
        sourceLanguage,
        targetLanguage: 'en',
        confidence: 1.0
      };
    }

    const lowerText = text.toLowerCase().trim();
    const reverseMap = this.reverseTranslations[sourceLanguage];
    
    // Direct phrase matching first
    if (reverseMap && reverseMap[lowerText]) {
      return {
        translatedText: reverseMap[lowerText],
        sourceLanguage,
        targetLanguage: 'en',
        confidence: 0.9
      };
    }

    // Try word-by-word translation for better coverage
    const words = lowerText.split(' ');
    const translatedWords: string[] = [];
    let totalConfidence = 0;
    let matchedWords = 0;

    words.forEach(word => {
      const cleanWord = word.trim();
      if (reverseMap && reverseMap[cleanWord]) {
        translatedWords.push(reverseMap[cleanWord]);
        totalConfidence += 0.9;
        matchedWords++;
      } else {
        // Try partial matching
        let bestMatch = '';
        let bestConfidence = 0;
        
        Object.entries(reverseMap || {}).forEach(([foreignPhrase, englishPhrase]) => {
          if (cleanWord.includes(foreignPhrase) || foreignPhrase.includes(cleanWord)) {
            const similarity = this.calculateSimilarity(cleanWord, foreignPhrase);
            if (similarity > bestConfidence && similarity > 0.6) {
              bestMatch = englishPhrase;
              bestConfidence = similarity;
            }
          }
        });
        
        if (bestMatch) {
          translatedWords.push(bestMatch);
          totalConfidence += bestConfidence;
          matchedWords++;
        } else {
          translatedWords.push(cleanWord);
          totalConfidence += 0.3;
          matchedWords++;
        }
      }
    });

    if (translatedWords.length > 0) {
      return {
        translatedText: translatedWords.join(' '),
        sourceLanguage,
        targetLanguage: 'en',
        confidence: matchedWords > 0 ? totalConfidence / matchedWords : 0.3
      };
    }

    // Fallback: try partial matching for complete phrases
    let bestMatch = '';
    let bestConfidence = 0;

    Object.entries(reverseMap || {}).forEach(([foreignPhrase, englishPhrase]) => {
      if (lowerText.includes(foreignPhrase) || foreignPhrase.includes(lowerText)) {
        const similarity = this.calculateSimilarity(lowerText, foreignPhrase);
        if (similarity > bestConfidence) {
          bestMatch = englishPhrase;
          bestConfidence = similarity;
        }
      }
    });

    if (bestMatch && bestConfidence > 0.5) {
      return {
        translatedText: bestMatch,
        sourceLanguage,
        targetLanguage: 'en',
        confidence: bestConfidence
      };
    }

    // If no translation found, return original text
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage: 'en',
      confidence: 0.3
    };
  }

  // Simple similarity calculation
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // Levenshtein distance calculation
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Get available languages
  getAvailableLanguages(): string[] {
    return ['en', 'hi', 'te', 'ta'];
  }

  // Check if language is supported
  isLanguageSupported(languageCode: string): boolean {
    return this.getAvailableLanguages().includes(languageCode);
  }

  // Get language-specific examples
  getExamplePhrases(languageCode: string): string[] {
    switch (languageCode) {
      case 'hi':
        return [
          'नमस्ते, आप कैसे हैं?',
          'मेरा नाम राम है',
          'धन्यवाद',
          'आपसे मिलकर खुशी हुई',
          'कृपया मेरी मदद करें'
        ];
      case 'te':
        return [
          'నమస్కారం, మీరు ఎలా ఉన్నారు?',
          'నా పేరు రాము',
          'ధన్యవాదాలు',
          'మిమ్మల్ని కలవడం ఆనందంగా ఉంది',
          'దయచేసి నాకు సహాయం చేయండి'
        ];
      case 'ta':
        return [
          'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
          'என் பெயர் ராம்',
          'நன்றி',
          'உங்களை சந்தித்ததில் மகிழ்ச்சி',
          'தயவுசெய்து எனக்கு உதவுங்கள்'
        ];
      default:
        return [
          'Hello, how are you?',
          'My name is Ram',
          'Thank you',
          'Nice to meet you',
          'Please help me'
        ];
    }
  }
}