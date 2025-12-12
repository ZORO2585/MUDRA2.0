// Text to Gloss conversion logic
export interface GlossRule {
  pattern: RegExp;
  replacement: string;
  priority: number;
}

export class TextToGlossConverter {
  private rules: GlossRule[] = [
    // High priority - specific phrases
    { pattern: /\bhow are you\b/gi, replacement: 'HOW YOU', priority: 10 },
    { pattern: /\bnice to meet you\b/gi, replacement: 'NICE MEET YOU', priority: 10 },
    { pattern: /\bwhat is your name\b/gi, replacement: 'WHAT YOUR NAME', priority: 10 },
    { pattern: /\bmy name is\b/gi, replacement: 'MY NAME', priority: 10 },
    { pattern: /\bthank you\b/gi, replacement: 'THANK YOU', priority: 10 },
    { pattern: /\bgood morning\b/gi, replacement: 'GOOD MORNING', priority: 10 },
    { pattern: /\bgood afternoon\b/gi, replacement: 'GOOD AFTERNOON', priority: 10 },
    { pattern: /\bgood evening\b/gi, replacement: 'GOOD EVENING', priority: 10 },
    { pattern: /\bgood night\b/gi, replacement: 'GOOD NIGHT', priority: 10 },
    { pattern: /\bsee you later\b/gi, replacement: 'SEE YOU LATER', priority: 10 },
    { pattern: /\bvery much\b/gi, replacement: 'VERY MUCH', priority: 10 },
    { pattern: /\bthank you very much\b/gi, replacement: 'THANK YOU VERY MUCH', priority: 11 },
    { pattern: /\bexcuse me\b/gi, replacement: 'EXCUSE ME', priority: 10 },
    { pattern: /\bi'm sorry\b/gi, replacement: 'I SORRY', priority: 10 },
    { pattern: /\byou're welcome\b/gi, replacement: 'YOU WELCOME', priority: 10 },
    { pattern: /\bno problem\b/gi, replacement: 'NO PROBLEM', priority: 10 },
    { pattern: /\bi love you\b/gi, replacement: 'I LOVE YOU', priority: 10 },
    { pattern: /\bi miss you\b/gi, replacement: 'I MISS YOU', priority: 10 },
    { pattern: /\btake care\b/gi, replacement: 'TAKE CARE', priority: 10 },
    { pattern: /\bgood luck\b/gi, replacement: 'GOOD LUCK', priority: 10 },
    { pattern: /\bhappy birthday\b/gi, replacement: 'HAPPY BIRTHDAY', priority: 10 },
    { pattern: /\bmerry christmas\b/gi, replacement: 'MERRY CHRISTMAS', priority: 10 },
    { pattern: /\bhappy new year\b/gi, replacement: 'HAPPY NEW YEAR', priority: 10 },
    { pattern: /\bcongratulations\b/gi, replacement: 'CONGRATULATIONS', priority: 10 },
    { pattern: /\bget well soon\b/gi, replacement: 'GET WELL SOON', priority: 10 },

    // Medium priority - common words and phrases
    { pattern: /\bi am\b/gi, replacement: 'I', priority: 8 },
    { pattern: /\byou are\b/gi, replacement: 'YOU', priority: 8 },
    { pattern: /\bhe is\b/gi, replacement: 'HE', priority: 8 },
    { pattern: /\bshe is\b/gi, replacement: 'SHE', priority: 8 },
    { pattern: /\bwe are\b/gi, replacement: 'WE', priority: 8 },
    { pattern: /\bthey are\b/gi, replacement: 'THEY', priority: 8 },
    
    // Articles and auxiliary verbs (often omitted in sign language)
    { pattern: /\bthe\b/gi, replacement: '', priority: 6 },
    { pattern: /\ba\b/gi, replacement: '', priority: 6 },
    { pattern: /\ban\b/gi, replacement: '', priority: 6 },
    { pattern: /\bis\b/gi, replacement: '', priority: 6 },
    { pattern: /\bare\b/gi, replacement: '', priority: 6 },
    { pattern: /\bwas\b/gi, replacement: '', priority: 6 },
    { pattern: /\bwere\b/gi, replacement: '', priority: 6 },
    { pattern: /\bwill\b/gi, replacement: 'FUTURE', priority: 6 },
    { pattern: /\bcan\b/gi, replacement: 'CAN', priority: 6 },
    { pattern: /\bcould\b/gi, replacement: 'CAN', priority: 6 },
    { pattern: /\bshould\b/gi, replacement: 'SHOULD', priority: 6 },
    { pattern: /\bwould\b/gi, replacement: 'WILL', priority: 6 },
    { pattern: /\bmight\b/gi, replacement: 'MAYBE', priority: 6 },
    { pattern: /\bmay\b/gi, replacement: 'MAYBE', priority: 6 },
    { pattern: /\bmust\b/gi, replacement: 'MUST', priority: 6 },
    { pattern: /\bhave to\b/gi, replacement: 'MUST', priority: 6 },
    { pattern: /\bneed to\b/gi, replacement: 'NEED', priority: 6 },
    { pattern: /\bgoing to\b/gi, replacement: 'FUTURE', priority: 6 },
    { pattern: /\bused to\b/gi, replacement: 'PAST', priority: 6 },

    // Question words
    { pattern: /\bwhat\b/gi, replacement: 'WHAT', priority: 7 },
    { pattern: /\bwho\b/gi, replacement: 'WHO', priority: 7 },
    { pattern: /\bwhere\b/gi, replacement: 'WHERE', priority: 7 },
    { pattern: /\bwhen\b/gi, replacement: 'WHEN', priority: 7 },
    { pattern: /\bwhy\b/gi, replacement: 'WHY', priority: 7 },
    { pattern: /\bhow\b/gi, replacement: 'HOW', priority: 7 },
    { pattern: /\bwhich\b/gi, replacement: 'WHICH', priority: 7 },

    // Time expressions
    { pattern: /\byesterday\b/gi, replacement: 'YESTERDAY', priority: 7 },
    { pattern: /\btoday\b/gi, replacement: 'TODAY', priority: 7 },
    { pattern: /\btomorrow\b/gi, replacement: 'TOMORROW', priority: 7 },
    { pattern: /\bnow\b/gi, replacement: 'NOW', priority: 7 },
    { pattern: /\blater\b/gi, replacement: 'LATER', priority: 7 },
    { pattern: /\bbefore\b/gi, replacement: 'BEFORE', priority: 7 },
    { pattern: /\bafter\b/gi, replacement: 'AFTER', priority: 7 },

    // Pronouns
    { pattern: /\bi\b/gi, replacement: 'I', priority: 5 },
    { pattern: /\byou\b/gi, replacement: 'YOU', priority: 5 },
    { pattern: /\bhe\b/gi, replacement: 'HE', priority: 5 },
    { pattern: /\bshe\b/gi, replacement: 'SHE', priority: 5 },
    { pattern: /\bit\b/gi, replacement: 'IT', priority: 5 },
    { pattern: /\bwe\b/gi, replacement: 'WE', priority: 5 },
    { pattern: /\bthey\b/gi, replacement: 'THEY', priority: 5 },

    // Common verbs
    { pattern: /\bgo\b/gi, replacement: 'GO', priority: 5 },
    { pattern: /\bcome\b/gi, replacement: 'COME', priority: 5 },
    { pattern: /\bsee\b/gi, replacement: 'SEE', priority: 5 },
    { pattern: /\bhear\b/gi, replacement: 'HEAR', priority: 5 },
    { pattern: /\bknow\b/gi, replacement: 'KNOW', priority: 5 },
    { pattern: /\bthink\b/gi, replacement: 'THINK', priority: 5 },
    { pattern: /\bwant\b/gi, replacement: 'WANT', priority: 5 },
    { pattern: /\bneed\b/gi, replacement: 'NEED', priority: 5 },
    { pattern: /\blike\b/gi, replacement: 'LIKE', priority: 5 },
    { pattern: /\blove\b/gi, replacement: 'LOVE', priority: 5 },
    { pattern: /\bhate\b/gi, replacement: 'HATE', priority: 5 },
    { pattern: /\bhelp\b/gi, replacement: 'HELP', priority: 5 },
    { pattern: /\bwork\b/gi, replacement: 'WORK', priority: 5 },
    { pattern: /\bplay\b/gi, replacement: 'PLAY', priority: 5 },
    { pattern: /\beat\b/gi, replacement: 'EAT', priority: 5 },
    { pattern: /\bdrink\b/gi, replacement: 'DRINK', priority: 5 },
    { pattern: /\bsleep\b/gi, replacement: 'SLEEP', priority: 5 },

    // Common adjectives
    { pattern: /\bgood\b/gi, replacement: 'GOOD', priority: 5 },
    { pattern: /\bbad\b/gi, replacement: 'BAD', priority: 5 },
    { pattern: /\bhappy\b/gi, replacement: 'HAPPY', priority: 5 },
    { pattern: /\bsad\b/gi, replacement: 'SAD', priority: 5 },
    { pattern: /\bbig\b/gi, replacement: 'BIG', priority: 5 },
    { pattern: /\bsmall\b/gi, replacement: 'SMALL', priority: 5 },
    { pattern: /\bhot\b/gi, replacement: 'HOT', priority: 5 },
    { pattern: /\bcold\b/gi, replacement: 'COLD', priority: 5 },
    { pattern: /\bfast\b/gi, replacement: 'FAST', priority: 5 },
    { pattern: /\bslow\b/gi, replacement: 'SLOW', priority: 5 },

    // Numbers (convert to uppercase)
    { pattern: /\bone\b/gi, replacement: 'ONE', priority: 5 },
    { pattern: /\btwo\b/gi, replacement: 'TWO', priority: 5 },
    { pattern: /\bthree\b/gi, replacement: 'THREE', priority: 5 },
    { pattern: /\bfour\b/gi, replacement: 'FOUR', priority: 5 },
    { pattern: /\bfive\b/gi, replacement: 'FIVE', priority: 5 },
    { pattern: /\bsix\b/gi, replacement: 'SIX', priority: 5 },
    { pattern: /\bseven\b/gi, replacement: 'SEVEN', priority: 5 },
    { pattern: /\beight\b/gi, replacement: 'EIGHT', priority: 5 },
    { pattern: /\bnine\b/gi, replacement: 'NINE', priority: 5 },
    { pattern: /\bten\b/gi, replacement: 'TEN', priority: 5 },

    // More common verbs
    { pattern: /\bmeet\b/gi, replacement: 'MEET', priority: 5 },
    { pattern: /\bfind\b/gi, replacement: 'FIND', priority: 5 },
    { pattern: /\blose\b/gi, replacement: 'LOSE', priority: 5 },
    { pattern: /\bwin\b/gi, replacement: 'WIN', priority: 5 },
    { pattern: /\btry\b/gi, replacement: 'TRY', priority: 5 },
    { pattern: /\bstart\b/gi, replacement: 'START', priority: 5 },
    { pattern: /\bstop\b/gi, replacement: 'STOP', priority: 5 },
    { pattern: /\bfinish\b/gi, replacement: 'FINISH', priority: 5 },
    { pattern: /\bchange\b/gi, replacement: 'CHANGE', priority: 5 },
    { pattern: /\bturn\b/gi, replacement: 'TURN', priority: 5 },
    { pattern: /\bmove\b/gi, replacement: 'MOVE', priority: 5 },
    { pattern: /\bstay\b/gi, replacement: 'STAY', priority: 5 },
    { pattern: /\bleave\b/gi, replacement: 'LEAVE', priority: 5 },
    { pattern: /\barrive\b/gi, replacement: 'ARRIVE', priority: 5 },
    { pattern: /\bwait\b/gi, replacement: 'WAIT', priority: 5 },
    { pattern: /\bhurry\b/gi, replacement: 'HURRY', priority: 5 },
    { pattern: /\brelax\b/gi, replacement: 'RELAX', priority: 5 },
    { pattern: /\brest\b/gi, replacement: 'REST', priority: 5 },
    { pattern: /\bwake\b/gi, replacement: 'WAKE', priority: 5 },
    { pattern: /\bwake up\b/gi, replacement: 'WAKE UP', priority: 6 },
    { pattern: /\bget up\b/gi, replacement: 'GET UP', priority: 6 },
    { pattern: /\bsit down\b/gi, replacement: 'SIT DOWN', priority: 6 },
    { pattern: /\bstand up\b/gi, replacement: 'STAND UP', priority: 6 },
    { pattern: /\blie down\b/gi, replacement: 'LIE DOWN', priority: 6 },
    { pattern: /\bput on\b/gi, replacement: 'PUT ON', priority: 6 },
    { pattern: /\btake off\b/gi, replacement: 'TAKE OFF', priority: 6 },
    { pattern: /\bpick up\b/gi, replacement: 'PICK UP', priority: 6 },
    { pattern: /\bput down\b/gi, replacement: 'PUT DOWN', priority: 6 },
    { pattern: /\bturn on\b/gi, replacement: 'TURN ON', priority: 6 },
    { pattern: /\bturn off\b/gi, replacement: 'TURN OFF', priority: 6 },
    { pattern: /\bopen up\b/gi, replacement: 'OPEN', priority: 6 },
    { pattern: /\bclose down\b/gi, replacement: 'CLOSE', priority: 6 },
    { pattern: /\blook at\b/gi, replacement: 'LOOK AT', priority: 6 },
    { pattern: /\blisten to\b/gi, replacement: 'LISTEN TO', priority: 6 },
    { pattern: /\btalk to\b/gi, replacement: 'TALK TO', priority: 6 },
    { pattern: /\bspeak to\b/gi, replacement: 'SPEAK TO', priority: 6 },
    { pattern: /\bthink about\b/gi, replacement: 'THINK ABOUT', priority: 6 },
    { pattern: /\bworry about\b/gi, replacement: 'WORRY ABOUT', priority: 6 },
    { pattern: /\bcare about\b/gi, replacement: 'CARE ABOUT', priority: 6 },
    { pattern: /\bdream about\b/gi, replacement: 'DREAM ABOUT', priority: 6 },

    // More adjectives
    { pattern: /\bbeautiful\b/gi, replacement: 'BEAUTIFUL', priority: 5 },
    { pattern: /\bugly\b/gi, replacement: 'UGLY', priority: 5 },
    { pattern: /\bpretty\b/gi, replacement: 'PRETTY', priority: 5 },
    { pattern: /\bhandsome\b/gi, replacement: 'HANDSOME', priority: 5 },
    { pattern: /\bcute\b/gi, replacement: 'CUTE', priority: 5 },
    { pattern: /\bnice\b/gi, replacement: 'NICE', priority: 5 },
    { pattern: /\bsweet\b/gi, replacement: 'SWEET', priority: 5 },
    { pattern: /\bkind\b/gi, replacement: 'KIND', priority: 5 },
    { pattern: /\bmean\b/gi, replacement: 'MEAN', priority: 5 },
    { pattern: /\brude\b/gi, replacement: 'RUDE', priority: 5 },
    { pattern: /\bpolite\b/gi, replacement: 'POLITE', priority: 5 },
    { pattern: /\bfriendly\b/gi, replacement: 'FRIENDLY', priority: 5 },
    { pattern: /\bsmart\b/gi, replacement: 'SMART', priority: 5 },
    { pattern: /\bclever\b/gi, replacement: 'CLEVER', priority: 5 },
    { pattern: /\bintelligent\b/gi, replacement: 'INTELLIGENT', priority: 5 },
    { pattern: /\bstupid\b/gi, replacement: 'STUPID', priority: 5 },
    { pattern: /\bfunny\b/gi, replacement: 'FUNNY', priority: 5 },
    { pattern: /\bserious\b/gi, replacement: 'SERIOUS', priority: 5 },
    { pattern: /\bquiet\b/gi, replacement: 'QUIET', priority: 5 },
    { pattern: /\bloud\b/gi, replacement: 'LOUD', priority: 5 },
    { pattern: /\bbusy\b/gi, replacement: 'BUSY', priority: 5 },
    { pattern: /\bfree\b/gi, replacement: 'FREE', priority: 5 },
    { pattern: /\brich\b/gi, replacement: 'RICH', priority: 5 },
    { pattern: /\bpoor\b/gi, replacement: 'POOR', priority: 5 },
    { pattern: /\bexpensive\b/gi, replacement: 'EXPENSIVE', priority: 5 },
    { pattern: /\bcheap\b/gi, replacement: 'CHEAP', priority: 5 },
    { pattern: /\bimportant\b/gi, replacement: 'IMPORTANT', priority: 5 },
    { pattern: /\bspecial\b/gi, replacement: 'SPECIAL', priority: 5 },
    { pattern: /\bnormal\b/gi, replacement: 'NORMAL', priority: 5 },
    { pattern: /\bstrange\b/gi, replacement: 'STRANGE', priority: 5 },
    { pattern: /\bdifferent\b/gi, replacement: 'DIFFERENT', priority: 5 },
    { pattern: /\bsame\b/gi, replacement: 'SAME', priority: 5 },
    { pattern: /\bsimilar\b/gi, replacement: 'SIMILAR', priority: 5 },
    { pattern: /\bother\b/gi, replacement: 'OTHER', priority: 5 },
    { pattern: /\banother\b/gi, replacement: 'ANOTHER', priority: 5 },
    { pattern: /\bnext\b/gi, replacement: 'NEXT', priority: 5 },
    { pattern: /\blast\b/gi, replacement: 'LAST', priority: 5 },
    { pattern: /\bfirst\b/gi, replacement: 'FIRST', priority: 5 },
    { pattern: /\bsecond\b/gi, replacement: 'SECOND', priority: 5 },
    { pattern: /\bthird\b/gi, replacement: 'THIRD', priority: 5 },
    { pattern: /\bfinal\b/gi, replacement: 'FINAL', priority: 5 },

    // Basic words - convert to uppercase
    { pattern: /\b(\w+)\b/g, replacement: (match: string) => match.toUpperCase(), priority: 1 }
  ];

  convertToGloss(text: string): string {
    let gloss = text.trim();
    
    // Handle empty or very short text
    if (!gloss || gloss.length < 2) {
      return gloss.toUpperCase();
    }
    
    // Sort rules by priority (highest first)
    const sortedRules = [...this.rules].sort((a, b) => b.priority - a.priority);
    
    // Apply rules in priority order
    for (const rule of sortedRules) {
      if (typeof rule.replacement === 'function') {
        gloss = gloss.replace(rule.pattern, rule.replacement as any);
      } else {
        gloss = gloss.replace(rule.pattern, rule.replacement);
      }
    }
    
    // Clean up extra spaces and punctuation
    gloss = gloss
      .replace(/[.,!?;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim();
    
    // Ensure we have some output
    if (!gloss) {
      return text.toUpperCase();
    }
    
    return gloss;
  }
}