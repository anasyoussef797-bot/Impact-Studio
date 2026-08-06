import { ChildCharacter, LanguageDialectId } from '../types';

export interface DialectOption {
  id: LanguageDialectId;
  name: string;
  nativeName: string;
  flag: string;
  localeCode: string;
  sampleText: string;
  keywords: string[];
}

export const LANGUAGE_DIALECTS: DialectOption[] = [
  {
    id: 'gulf_ar',
    name: 'Gulf Arabic',
    nativeName: 'اللهجة الخليجية',
    flag: '🇦🇪',
    localeCode: 'ar-AE',
    sampleText: 'هلا والله! شحالكم يا أطفال؟ أهلاً بكم في إمباكت ستوديو',
    keywords: ['ar-ae', 'ar-sa', 'ar-kw', 'gulf', 'ae', 'sa', 'ar']
  },
  {
    id: 'fusha_ar',
    name: 'Modern Standard Arabic',
    nativeName: 'العربية الفصحى',
    flag: '🇸🇦',
    localeCode: 'ar-SA',
    sampleText: 'مرحباً بكم أصدقائي في تطبيق تحويل النص إلى صوت الأطفال والمعلمين',
    keywords: ['ar-sa', 'ar-eg', 'fusha', 'ar']
  },
  {
    id: 'egyptian_ar',
    name: 'Egyptian Arabic',
    nativeName: 'العامية المصرية',
    flag: '🇪🇬',
    localeCode: 'ar-EG',
    sampleText: 'أهلاً بيكم يا أصحابنا، يلا بينا نتكلم كلنا مع بعض!',
    keywords: ['ar-eg', 'egypt', 'eg', 'ar']
  },
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    localeCode: 'en-US',
    sampleText: 'Hello everyone! Welcome to Impact Studio children and teacher voice narrator.',
    keywords: ['en-us', 'en-gb', 'en']
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    sampleText: 'Bonjour les enfants! Bienvenue dans le studio de voix d Impact Studio.',
    keywords: ['fr-fr', 'fr']
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    sampleText: 'Hallo Kinder! Willkommen im Impact Studio Kinderstimmen-Studio.',
    keywords: ['de-de', 'de']
  }
];

export const INITIAL_CHARACTERS: ChildCharacter[] = [
  {
    id: 'char_lulu',
    name: 'Lulu',
    arabicName: 'لولو',
    avatar: '👧',
    pitch: 1.35, // Clear, cute young girl child voice
    speechRate: 0.92,
    preferredLanguage: 'gulf_ar',
    color: '#FD79A8',
    staggerDelayMs: 0,
    role: 'child',
    gender: 'female'
  },
  {
    id: 'char_rashed',
    name: 'Rashed',
    arabicName: 'راشد',
    avatar: '👦',
    pitch: 1.25, // Energetic young boy child voice
    speechRate: 0.88,
    preferredLanguage: 'gulf_ar',
    color: '#0984E3',
    staggerDelayMs: 40,
    role: 'child',
    gender: 'male'
  },
  {
    id: 'char_noor',
    name: 'Noor',
    arabicName: 'نور',
    avatar: '👧🏽',
    pitch: 1.38, // Bright little kid girl voice
    speechRate: 0.94,
    preferredLanguage: 'egyptian_ar',
    color: '#00CEC9',
    staggerDelayMs: 80,
    role: 'child',
    gender: 'female'
  },
  {
    id: 'char_ali',
    name: 'Ali',
    arabicName: 'علي',
    avatar: '👦🏻',
    pitch: 1.20, // Calm young boy voice
    speechRate: 0.85,
    preferredLanguage: 'fusha_ar',
    color: '#6C5CE7',
    staggerDelayMs: 120,
    role: 'child',
    gender: 'male'
  },
  {
    id: 'char_sara',
    name: 'Sara',
    arabicName: 'سارة',
    avatar: '👧🏼',
    pitch: 1.32, // Playful child girl voice
    speechRate: 0.90,
    preferredLanguage: 'english',
    color: '#E17055',
    staggerDelayMs: 160,
    role: 'child',
    gender: 'female'
  },
  {
    id: 'char_maryam',
    name: 'Ms. Maryam',
    arabicName: 'المعلمة مريم',
    avatar: '👩‍🏫',
    pitch: 1.05, // Clear adult female teacher voice
    speechRate: 0.95,
    preferredLanguage: 'fusha_ar',
    color: '#EC407A',
    staggerDelayMs: 200,
    role: 'teacher',
    gender: 'female'
  },
  {
    id: 'char_ahmed',
    name: 'Mr. Ahmed',
    arabicName: 'المعلم أحمد',
    avatar: '👨‍🏫',
    pitch: 0.70, // Deep adult male teacher voice
    speechRate: 0.85,
    preferredLanguage: 'fusha_ar',
    color: '#2E7D32',
    staggerDelayMs: 240,
    role: 'teacher',
    gender: 'male'
  }
];

export class WebStudioSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeTimers: number[] = [];
  private activeAudios: HTMLAudioElement[] = [];
  private isStopped = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public findBestVoice(dialectId: LanguageDialectId, gender?: 'female' | 'male'): SpeechSynthesisVoice | null {
    const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];
    const available = this.getAvailableVoices();

    if (available.length === 0) return null;

    const isArabic = dialectId.includes('ar');
    const femaleKeywords = ['zira', 'laila', 'salma', 'zeina', 'hoda', 'mariam', 'samantha', 'victoria', 'female', 'woman', 'kore', 'yuna'];
    const maleKeywords = ['maged', 'tarik', 'tariq', 'nizar', 'naayf', 'mehdi', 'male', 'man', 'david', 'george', 'alex', 'adam', 'thomas', 'stefan', 'mark'];

    // Filter by language first
    let langVoices = available.filter((v) => {
      const vLang = v.lang.toLowerCase();
      if (isArabic) {
        return vLang.startsWith('ar') || v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('العربية');
      }
      return vLang.startsWith(dialect.localeCode.split('-')[0].toLowerCase());
    });

    if (langVoices.length === 0) {
      langVoices = available;
    }

    if (gender === 'female') {
      const femaleMatch = langVoices.find((v) =>
        femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (femaleMatch) return femaleMatch;
    } else if (gender === 'male') {
      const maleMatch = langVoices.find((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (maleMatch) return maleMatch;

      // Exclude known female voices to guarantee a male tone
      const nonFemaleMatch = langVoices.find(
        (v) => !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (nonFemaleMatch) return nonFemaleMatch;
    }

    return langVoices[0] || available[0] || null;
  }

  /**
   * Split text into shorter phrases (max 120 chars) for stable TTS playback
   */
  private splitTextIntoSentences(text: string): string[] {
    const clean = text.trim();
    if (!clean) return [];

    const sentenceRegex = /([.،؟!\n؛]+)/;
    const parts = clean.split(sentenceRegex);
    const result: string[] = [];
    let buffer = '';

    for (const part of parts) {
      if ((buffer + part).length <= 120) {
        buffer += part;
      } else {
        if (buffer.trim()) result.push(buffer.trim());
        buffer = part;
      }
    }
    if (buffer.trim()) result.push(buffer.trim());

    return result.length > 0 ? result : [clean];
  }

  /**
   * Main entry point to speak for selected characters (supports single character solo or chorus)
   */
  public speakGroupChorus(
    text: string,
    characters: ChildCharacter[],
    dialectId: LanguageDialectId,
    onStart: () => void,
    onEnd: () => void
  ) {
    const cleanText = text.trim();
    if (!cleanText || characters.length === 0) {
      onEnd();
      return;
    }

    this.stop();
    this.isStopped = false;
    onStart();

    const isArabic = /[\u0600-\u06FF]/.test(cleanText) || dialectId.includes('ar');
    const sentences = this.splitTextIntoSentences(cleanText);

    // Warm up / unstick SpeechSynthesis immediately
    if (this.synth) {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
    }

    let completedChars = 0;
    const totalChars = characters.length;

    const handleCharComplete = () => {
      completedChars++;
      if (completedChars >= totalChars && !this.isStopped) {
        onEnd();
      }
    };

    // Speak for each character
    characters.forEach((char, charIndex) => {
      const staggerDelay = charIndex * 50; // Chorus stagger offset

      const timerId = window.setTimeout(() => {
        if (this.isStopped) return;
        this.playCharacterSequential(sentences, char, dialectId, isArabic, handleCharComplete);
      }, staggerDelay);

      this.activeTimers.push(timerId);
    });
  }

  /**
   * Play sentences for a given character using Web Speech API with fallback
   */
  private playCharacterSequential(
    sentences: string[],
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    onDone: () => void
  ) {
    let sentenceIndex = 0;

    const speakNextSentence = () => {
      if (this.isStopped || sentenceIndex >= sentences.length) {
        onDone();
        return;
      }

      const sentence = sentences[sentenceIndex];
      sentenceIndex++;

      // Try SpeechSynthesisUtterance first
      if (this.synth && 'SpeechSynthesisUtterance' in window) {
        this.speakWithSpeechSynthesis(sentence, char, dialectId, isArabic, () => {
          speakNextSentence();
        });
      } else {
        // Online Audio TTS fallback
        this.speakWithAudioFallback(sentence, char, dialectId, isArabic, () => {
          speakNextSentence();
        });
      }
    };

    speakNextSentence();
  }

  /**
   * Speak sentence using native Web Speech API
   */
  private speakWithSpeechSynthesis(
    sentence: string,
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    onNext: () => void
  ) {
    if (!this.synth) {
      onNext();
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(sentence);
      const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];

      // Match best voice for gender
      const bestVoice = this.findBestVoice(dialectId, char.gender);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        // Fallback locale for Arabic
        utterance.lang = isArabic ? 'ar-SA' : dialect.localeCode;
      }

      // Enforce distinct, clear pitches without chipmunk distortion
      // Girls: 1.30 to 1.38
      // Boys: 1.18 to 1.25
      // Female Teacher: 1.05
      // Male Teacher: 0.70
      utterance.pitch = Math.min(1.45, Math.max(0.65, char.pitch));
      utterance.rate = Math.min(1.3, Math.max(0.7, char.speechRate));

      let hasEnded = false;
      const markNext = () => {
        if (!hasEnded) {
          hasEnded = true;
          onNext();
        }
      };

      utterance.onend = markNext;
      utterance.onerror = (e) => {
        console.warn('Utterance error, switching to Audio fallback:', e);
        if (!hasEnded) {
          hasEnded = true;
          // Fallback to audio if WebSpeech fails
          this.speakWithAudioFallback(sentence, char, dialectId, isArabic, onNext);
        }
      };

      // Watchdog timer in case Chrome hangs on speech utterance
      const watchdog = setTimeout(() => {
        if (!hasEnded) {
          console.warn('Utterance watchdog timeout, continuing...');
          markNext();
        }
      }, Math.max(3500, sentence.length * 120));
      this.activeTimers.push(watchdog as unknown as number);

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis exception:', err);
      this.speakWithAudioFallback(sentence, char, dialectId, isArabic, onNext);
    }
  }

  /**
   * Fallback using Google Translate TTS / Voice audio element
   */
  private speakWithAudioFallback(
    sentence: string,
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    onNext: () => void
  ) {
    if (this.isStopped) {
      onNext();
      return;
    }

    try {
      const langCode = isArabic ? 'ar' : (dialectId === 'english' ? 'en' : 'ar');
      const encoded = encodeURIComponent(sentence);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encoded}&tl=${langCode}`;

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = url;

      // Adjust playback rate for pitch variation
      audio.playbackRate = Math.min(1.3, Math.max(0.8, char.pitch > 1.2 ? 1.15 : char.pitch < 0.9 ? 0.85 : 1.0));

      this.activeAudios.push(audio);

      let finished = false;
      const finish = () => {
        if (!finished) {
          finished = true;
          onNext();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        finish();
      };

      audio.play().catch(() => {
        finish();
      });
    } catch (e) {
      console.error('Audio fallback error:', e);
      onNext();
    }
  }

  /**
   * Stop all active speech
   */
  public stop() {
    this.isStopped = true;

    // Clear active timers
    this.activeTimers.forEach((id) => clearTimeout(id));
    this.activeTimers = [];

    // Pause audio elements
    this.activeAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    });
    this.activeAudios = [];

    // Cancel Web Speech API
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
  }
}

export const speechEngine = new WebStudioSpeechEngine();
