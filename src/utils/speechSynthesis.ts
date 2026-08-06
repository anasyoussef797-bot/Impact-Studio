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
    pitch: 1.60, // Cute young girl child pitch
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
    pitch: 1.35, // Energetic young boy child pitch
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
    pitch: 1.75, // Bright little kid girl pitch
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
    pitch: 1.25, // Calm young boy pitch
    speechRate: 0.84,
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
    pitch: 1.50, // Playful child girl pitch
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
    pitch: 1.05, // Clear adult female teacher pitch
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
    pitch: 0.82, // Deep adult male teacher pitch
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
  private currentAudios: HTMLAudioElement[] = [];
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

    let candidates: SpeechSynthesisVoice[] = [];
    for (const keyword of dialect.keywords) {
      const matches = available.filter(
        (v) => v.lang.toLowerCase().includes(keyword) || v.name.toLowerCase().includes(keyword)
      );
      if (matches.length > 0) {
        candidates.push(...matches);
      }
    }

    if (candidates.length === 0) {
      const langPrefix = dialect.localeCode.split('-')[0].toLowerCase();
      candidates = available.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    }

    if (candidates.length === 0) {
      candidates = available;
    }

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

  /**
   * Helper to split text into chunks (< 140 chars) for smooth Arabic audio playback
   */
  private splitTextIntoChunks(text: string): string[] {
    const clean = text.trim();
    if (!clean) return [];

    // Split on Arabic/English sentence delimiters
    const sentences = clean.split(/([.،؟!\n؛]+)/);
    const chunks: string[] = [];
    let current = '';

    for (const part of sentences) {
      if ((current + part).length <= 130) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        current = part;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    return chunks.length > 0 ? chunks : [clean];
  }

  /**
   * Play speech for selected characters (supports single character solo or group chorus)
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
    const chunks = this.splitTextIntoChunks(cleanText);

    let finishedChars = 0;
    const totalChars = characters.length;

    const handleCharDone = () => {
      finishedChars++;
      if (finishedChars >= totalChars && !this.isStopped) {
        onEnd();
      }
    };

    // For each selected character, play the chunks with pitch modulation
    characters.forEach((char, charIdx) => {
      const staggerDelay = charIdx * 60; // Slightly staggered start for group sound

      const timerId = window.setTimeout(() => {
        if (this.isStopped) return;
        this.playCharacterChunks(chunks, char, dialectId, isArabic, handleCharDone);
      }, staggerDelay);

      this.activeTimers.push(timerId);
    });
  }

  /**
   * Sequential playback of audio chunks for a specific character with pitch-shifting
   */
  private playCharacterChunks(
    chunks: string[],
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    onFinished: () => void
  ) {
    let currentChunkIdx = 0;

    const playNextChunk = () => {
      if (this.isStopped || currentChunkIdx >= chunks.length) {
        onFinished();
        return;
      }

      const chunkText = chunks[currentChunkIdx];
      currentChunkIdx++;

      // Primary strategy: HTML5 Audio with preservesPitch = false
      // This enforces TRUE acoustic pitch modification (high pitch = real child voice)
      const langCode = isArabic ? 'ar' : (dialectId === 'english' ? 'en' : 'ar');
      const encodedText = encodeURIComponent(chunkText);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${langCode}`;

      const audio = new Audio(ttsUrl);
      
      // Disable pitch preservation so changing playbackRate alters acoustic frequency
      (audio as any).preservesPitch = false;
      (audio as any).webkitPreservesPitch = false;
      (audio as any).mozPreservesPitch = false;

      // Apply exact character pitch
      audio.playbackRate = Math.min(2.0, Math.max(0.5, char.pitch));

      this.currentAudios.push(audio);

      audio.onended = () => {
        playNextChunk();
      };

      audio.onerror = () => {
        // Fallback to Web Speech API Utterance if network audio fails
        this.speakWebSpeechUtterance(chunkText, char, dialectId, isArabic, () => {
          playNextChunk();
        });
      };

      audio.play().catch(() => {
        // Fallback to Web Speech API if autoplay restricted
        this.speakWebSpeechUtterance(chunkText, char, dialectId, isArabic, () => {
          playNextChunk();
        });
      });
    };

    playNextChunk();
  }

  /**
   * Fallback using Web Speech API Utterance
   */
  private speakWebSpeechUtterance(
    text: string,
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    onEnded: () => void
  ) {
    if (!this.synth || typeof SpeechSynthesisUtterance === 'undefined') {
      onEnded();
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];
      const voice = this.findBestVoice(dialectId, char.gender);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = isArabic ? 'ar-SA' : dialect.localeCode;
      }

      utterance.pitch = Math.min(2.0, Math.max(0.5, char.pitch));
      utterance.rate = Math.min(1.5, Math.max(0.5, char.speechRate));

      let hasFinished = false;
      const markDone = () => {
        if (!hasFinished) {
          hasFinished = true;
          onEnded();
        }
      };

      utterance.onend = markDone;
      utterance.onerror = markDone;

      // Safety timeout in case SpeechSynthesis utterance hangs
      const safetyTimeout = setTimeout(markDone, Math.max(3000, text.length * 100));
      this.activeTimers.push(safetyTimeout as unknown as number);

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('WebSpeech utterance error:', err);
      onEnded();
    }
  }

  /**
   * Immediately stop all active speech playback
   */
  public stop() {
    this.isStopped = true;

    // Clear all pending timers
    this.activeTimers.forEach((id) => clearTimeout(id));
    this.activeTimers = [];

    // Pause all playing audio elements
    this.currentAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    });
    this.currentAudios = [];

    // Cancel browser synthesis
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
