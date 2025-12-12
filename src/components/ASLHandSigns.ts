// ASL Hand Signs and Fingerspelling System
export interface HandSign {
  letter: string;
  emoji: string;
  description: string;
  handShape: string;
}

// CURRENT SIGNS THAT NEED TO BE UPDATED
// Please provide the correct emojis for these:

export const aslAlphabet: HandSign[] = [
  // ALPHABET SIGNS TO BE UPDATED - Please provide correct emojis
  { letter: 'A', emoji: '✊', description: 'Closed fist with thumb on side', handShape: 'fist' },
  { letter: 'B', emoji: '🖐️', description: 'Open palm, fingers together, thumb across palm', handShape: 'open' },
  { letter: 'C', emoji: '🤏', description: 'Curved hand forming C shape', handShape: 'curved' },
  { letter: 'D', emoji: '👆', description: 'Index finger up, other fingers and thumb together', handShape: 'point' },
  { letter: 'E', emoji: '✊', description: 'Fingers bent down touching thumb', handShape: 'bent' },
  { letter: 'F', emoji: '👌', description: 'Index and thumb touching, other fingers up', handShape: 'ok' },
  { letter: 'G', emoji: '👆', description: 'Index finger and thumb pointing sideways', handShape: 'point' },
  { letter: 'H', emoji: '✌️', description: 'Index and middle finger sideways', handShape: 'two' },
  { letter: 'I', emoji: '🤟', description: 'Pinky finger up', handShape: 'pinky' },
  { letter: 'J', emoji: '🤟', description: 'Pinky finger drawing J motion', handShape: 'pinky' },
  { letter: 'K', emoji: '✌️', description: 'Index and middle up, thumb between', handShape: 'v' },
  { letter: 'L', emoji: '🤟', description: 'Index up, thumb out forming L', handShape: 'l' },
  { letter: 'M', emoji: '✊', description: 'Three fingers over thumb', handShape: 'fist' },
  { letter: 'N', emoji: '✊', description: 'Two fingers over thumb', handShape: 'fist' },
  { letter: 'O', emoji: '👌', description: 'All fingers and thumb forming O', handShape: 'circle' },
  { letter: 'P', emoji: '👆', description: 'Index down, middle and thumb touching', handShape: 'point' },
  { letter: 'Q', emoji: '👆', description: 'Index and thumb down pointing', handShape: 'point' },
  { letter: 'R', emoji: '✌️', description: 'Index and middle crossed', handShape: 'cross' },
  { letter: 'S', emoji: '✊', description: 'Fist with thumb over fingers', handShape: 'fist' },
  { letter: 'T', emoji: '✊', description: 'Thumb between index and middle', handShape: 'fist' },
  { letter: 'U', emoji: '✌️', description: 'Index and middle up together', handShape: 'two' },
  { letter: 'V', emoji: '✌️', description: 'Index and middle up apart', handShape: 'victory' },
  { letter: 'W', emoji: '🤟', description: 'Index, middle, ring up', handShape: 'three' },
  { letter: 'X', emoji: '👆', description: 'Index finger bent like hook', handShape: 'hook' },
  { letter: 'Y', emoji: '🤟', description: 'Thumb and pinky out', handShape: 'shaka' },
  { letter: 'Z', emoji: '👆', description: 'Index finger drawing Z motion', handShape: 'point' }
];

export const aslNumbers: HandSign[] = [
  // NUMBER SIGNS TO BE UPDATED - Please provide correct emojis
  { letter: '0', emoji: '👌', description: 'Thumb and index forming O', handShape: 'circle' },
  { letter: '1', emoji: '☝️', description: 'Index finger up', handShape: 'one' },
  { letter: '2', emoji: '✌️', description: 'Index and middle up', handShape: 'two' },
  { letter: '3', emoji: '🤟', description: 'Thumb, index, middle up', handShape: 'three' },
  { letter: '4', emoji: '🖖', description: 'Four fingers up', handShape: 'four' },
  { letter: '5', emoji: '🖐️', description: 'All five fingers up', handShape: 'five' },
  { letter: '6', emoji: '🤟', description: 'Thumb and pinky touching, others up', handShape: 'six' },
  { letter: '7', emoji: '🤟', description: 'Thumb and ring touching, others up', handShape: 'seven' },
  { letter: '8', emoji: '🤟', description: 'Thumb and middle touching, others up', handShape: 'eight' },
  { letter: '9', emoji: '🤟', description: 'Thumb and index touching, others up', handShape: 'nine' },
  { letter: '10', emoji: '👊', description: 'Thumb up from fist', handShape: 'ten' }
];

export class ASLFingerspelling {
  private alphabet: Map<string, HandSign>;
  private numbers: Map<string, HandSign>;

  constructor() {
    this.alphabet = new Map(aslAlphabet.map(sign => [sign.letter, sign]));
    this.numbers = new Map(aslNumbers.map(sign => [sign.letter, sign]));
  }

  spellWord(word: string): HandSign[] {
    return word.toUpperCase().split('').map(char => {
      if (this.alphabet.has(char)) {
        return this.alphabet.get(char)!;
      } else if (this.numbers.has(char)) {
        return this.numbers.get(char)!;
      } else {
        return { letter: char, emoji: '❓', description: 'Unknown character', handShape: 'unknown' };
      }
    });
  }

  getLetterSign(letter: string): HandSign | null {
    const upperLetter = letter.toUpperCase();
    return this.alphabet.get(upperLetter) || this.numbers.get(upperLetter) || null;
  }

  getAllSigns(): { alphabet: HandSign[], numbers: HandSign[] } {
    return {
      alphabet: aslAlphabet,
      numbers: aslNumbers
    };
  }
}