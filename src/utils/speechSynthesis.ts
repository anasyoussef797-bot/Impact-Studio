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
    pitch: 1.70,
    speechRate: 0.90,
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
    pitch: 1.45,
    speechRate: 0.86,
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
    pitch: 1.85,
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
    pitch: 1.50,
    speechRate: 0.82,
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
    pitch: 1.62,
    speechRate: 0.88,
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
    pitch: 1.15,
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
    pitch: 0.82,
    speechRate: 0.88,
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
  private fallbackAudio: HTMLAudioElement | null = null;

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

    // Filter candidate voices by dialect keywords
    let candidates: SpeechSynthesisVoice[] = [];
    for (const keyword of dialect.keywords) {
      const matches = available.filter(
        (v) => v.lang.toLowerCase().includes(keyword) || v.name.toLowerCase().includes(keyword)
      );
      if (matches.length > 0) {
        candidates.push(...matches);
      }
    }

    // Fallback to any voice with language prefix (e.g. 'ar')
    if (candidates.length === 0) {
      const langPrefix = dialect.localeCode.split('-')[0].toLowerCase();
      candidates = available.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    }

    if (candidates.length === 0) {
      candidates = available;
    }

    // Filter by gender if available
    if (gender) {
      const genderKeywords = gender === 'female'
        ? ['female', 'woman', 'zira', 'laila', 'salma', 'zeina', 'hoda', 'mariam', 'samantha', 'victoria']
        : ['male', 'man', 'david', 'maged', 'tariq', 'zayd', 'george', 'alex'];
      
      const genderMatch = candidates.find((v) =>
        genderKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (genderMatch) return genderMatch;
    }

    return candidates[0] || available[0] || null;
  }

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
    onStart();

    const isArabicText = /[\u0600-\u06FF]/.test(cleanText);
    const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];

    // Unstick SpeechSynthesis in Chrome if paused
    if (this.synth) {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
    }

    let finishedCount = 0;
    const totalCount = characters.length;
    let fallbackTriggered = false;

    // Safety watchdog timer (e.g. 15 seconds max or based on text length)
    const watchdogDuration = Math.max(4000, cleanText.length * 120 + 3000);
    const watchdogId = window.setTimeout(() => {
      if (!fallbackTriggered && finishedCount < totalCount) {
        fallbackTriggered = true;
        this.stop();
        onEnd();
      }
    }, watchdogDuration);
    this.activeTimers.push(watchdogId);

    // Try SpeechSynthesis for each character
    if (this.synth && 'SpeechSynthesisUtterance' in window) {
      characters.forEach((char, index) => {
        const staggerTime = index * 40; // Chorus stagger delay
        const timerId = window.setTimeout(() => {
          try {
            const utterance = new SpeechSynthesisUtterance(cleanText);

            const matchedVoice = this.findBestVoice(dialectId, char.gender);
            if (matchedVoice) {
              utterance.voice = matchedVoice;
              utterance.lang = matchedVoice.lang;
            } else {
              // Ensure valid language code for Arabic text to prevent silent failures
              utterance.lang = isArabicText ? 'ar-SA' : dialect.localeCode;
            }

            // Apply exact pitch (0.5 to 2.0) & rate (0.5 to 1.5)
            utterance.pitch = Math.min(2.0, Math.max(0.5, char.pitch));
            utterance.rate = Math.min(1.5, Math.max(0.5, char.speechRate));

            const markDone = () => {
              finishedCount++;
              if (finishedCount >= totalCount && !fallbackTriggered) {
                clearTimeout(watchdogId);
                onEnd();
              }
            };

            utterance.onend = markDone;
            utterance.onerror = (e) => {
              console.warn('Utterance error:', e);
              markDone();
            };

            this.synth?.speak(utterance);
          } catch (err) {
            console.error('Speech synthesis execution failed:', err);
            finishedCount++;
            if (finishedCount >= totalCount && !fallbackTriggered) {
              clearTimeout(watchdogId);
              onEnd();
            }
          }
        }, staggerTime);

        this.activeTimers.push(timerId);
      });
    } else {
      // Fallback if SpeechSynthesis is unavailable
      this.playOnlineTTSFallback(cleanText, dialectId, onEnd);
    }
  }

  private playOnlineTTSFallback(text: string, dialectId: LanguageDialectId, onEnd: () => void) {
    try {
      const isArabic = /[\u0600-\u06FF]/.test(text) || dialectId.includes('ar');
      const langCode = isArabic ? 'ar' : 'en';
      const encodedText = encodeURIComponent(text.slice(0, 150));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${langCode}`;

      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
      }

      this.fallbackAudio = new Audio(url);
      this.fallbackAudio.onended = () => onEnd();
      this.fallbackAudio.onerror = () => onEnd();
      this.fallbackAudio.play().catch(() => onEnd());
    } catch (e) {
      console.error('Online TTS fallback error:', e);
      onEnd();
    }
  }

  public stop() {
    this.activeTimers.forEach((id) => clearTimeout(id));
    this.activeTimers = [];
    if (this.fallbackAudio) {
      this.fallbackAudio.pause();
      this.fallbackAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechEngine = new WebStudioSpeechEngine();
