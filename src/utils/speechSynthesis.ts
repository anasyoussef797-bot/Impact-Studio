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
    keywords: ['ar-ae', 'ar-sa', 'ar-kw', 'gulf', 'ae', 'sa']
  },
  {
    id: 'fusha_ar',
    name: 'Modern Standard Arabic',
    nativeName: 'العربية الفصحى',
    flag: '🇸🇦',
    localeCode: 'ar-XA',
    sampleText: 'مرحباً بكم أصدقائي في تطبيق تحويل النص إلى صوت الأطفال',
    keywords: ['ar-xa', 'ar-001', 'fusha', 'ar']
  },
  {
    id: 'egyptian_ar',
    name: 'Egyptian Arabic',
    nativeName: 'العامية المصرية',
    flag: '🇪🇬',
    localeCode: 'ar-EG',
    sampleText: 'أهلاً بيكم يا أصحابنا، يلا بينا نتكلم كلنا مع بعض!',
    keywords: ['ar-eg', 'egypt', 'eg']
  },
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    localeCode: 'en-US',
    sampleText: 'Hello everyone! Welcome to Impact Studio children voice narrator.',
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
    pitch: 1.55,
    speechRate: 0.88,
    preferredLanguage: 'gulf_ar',
    color: '#FD79A8',
    staggerDelayMs: 0
  },
  {
    id: 'char_rashed',
    name: 'Rashed',
    arabicName: 'راشد',
    avatar: '👦',
    pitch: 1.45,
    speechRate: 0.85,
    preferredLanguage: 'gulf_ar',
    color: '#0984E3',
    staggerDelayMs: 40
  },
  {
    id: 'char_noor',
    name: 'Noor',
    arabicName: 'نور',
    avatar: '👧🏽',
    pitch: 1.60,
    speechRate: 0.90,
    preferredLanguage: 'egyptian_ar',
    color: '#00CEC9',
    staggerDelayMs: 80
  },
  {
    id: 'char_ali',
    name: 'Ali',
    arabicName: 'علي',
    avatar: '👦🏻',
    pitch: 1.40,
    speechRate: 0.82,
    preferredLanguage: 'fusha_ar',
    color: '#6C5CE7',
    staggerDelayMs: 120
  },
  {
    id: 'char_sara',
    name: 'Sara',
    arabicName: 'سارة',
    avatar: '👧🏼',
    pitch: 1.50,
    speechRate: 0.87,
    preferredLanguage: 'english',
    color: '#E17055',
    staggerDelayMs: 160
  }
];

export class WebStudioSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeTimers: number[] = [];

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

  public findBestVoice(dialectId: LanguageDialectId): SpeechSynthesisVoice | null {
    const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];
    const available = this.getAvailableVoices();

    if (available.length === 0) return null;

    // Search keywords
    for (const keyword of dialect.keywords) {
      const match = available.find(
        (v) => v.lang.toLowerCase().includes(keyword) || v.name.toLowerCase().includes(keyword)
      );
      if (match) return match;
    }

    // Fallback search by lang prefix (e.g. "ar", "en", "fr", "de")
    const langPrefix = dialect.localeCode.split('-')[0].toLowerCase();
    const fallbackMatch = available.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    return fallbackMatch || available[0] || null;
  }

  public speakGroupChorus(
    text: string,
    characters: ChildCharacter[],
    dialectId: LanguageDialectId,
    onStart: () => void,
    onEnd: () => void
  ) {
    if (!this.synth || characters.length === 0 || !text.trim()) {
      onEnd();
      return;
    }

    this.stop();
    onStart();

    const matchedVoice = this.findBestVoice(dialectId);
    let finishedCount = 0;

    characters.forEach((char, index) => {
      const staggerTime = index * 50; // 50ms chorus offset per child
      const timerId = window.setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        }

        // Apply pitch (1.0 to 2.0) and rate (0.5 to 1.5)
        utterance.pitch = Math.min(2.0, Math.max(0.5, char.pitch));
        utterance.rate = Math.min(1.5, Math.max(0.5, char.speechRate));

        utterance.onend = () => {
          finishedCount++;
          if (finishedCount >= characters.length) {
            onEnd();
          }
        };

        utterance.onerror = () => {
          finishedCount++;
          if (finishedCount >= characters.length) {
            onEnd();
          }
        };

        this.synth?.speak(utterance);
      }, staggerTime);

      this.activeTimers.push(timerId);
    });
  }

  public stop() {
    this.activeTimers.forEach((id) => clearTimeout(id));
    this.activeTimers = [];
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechEngine = new WebStudioSpeechEngine();
