import { ChildCharacter, LanguageDialectId, VoiceMood } from '../types';
import { enhanceArabicTextForSpeech } from './arabicUtils';

export interface DialectOption {
  id: LanguageDialectId;
  name: string;
  nativeName: string;
  flag: string;
  localeCode: string;
  sampleText: string;
  keywords: string[];
}

export interface MoodOption {
  id: VoiceMood;
  name: string;
  arabicName: string;
  emoji: string;
  pitchOffset: number;
  rateOffset: number;
}

export const MOOD_PRESETS: MoodOption[] = [
  { id: 'happy', name: 'Happy', arabicName: 'فرح / سعيد', emoji: '😊', pitchOffset: 0.12, rateOffset: 0.05 },
  { id: 'enthusiastic', name: 'Enthusiastic', arabicName: 'حماسي', emoji: '🚀', pitchOffset: 0.20, rateOffset: 0.12 },
  { id: 'playful', name: 'Playful', arabicName: 'مرح / لعوب', emoji: '🎈', pitchOffset: 0.22, rateOffset: 0.08 },
  { id: 'sad', name: 'Sad', arabicName: 'حزين', emoji: '😢', pitchOffset: -0.22, rateOffset: -0.20 },
  { id: 'calm', name: 'Calm', arabicName: 'هادئ', emoji: '🧘‍♂️', pitchOffset: -0.10, rateOffset: -0.10 },
  { id: 'storytelling', name: 'Storytelling', arabicName: 'حكواتي / سرد', emoji: '📖', pitchOffset: 0.05, rateOffset: -0.05 },
];

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
    pitch: 1.70, // Authentic high child girl voice
    speechRate: 0.95,
    mood: 'happy',
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
    pitch: 1.55, // Energetic child boy voice
    speechRate: 0.92,
    mood: 'enthusiastic',
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
    pitch: 1.62, // Sweet kid girl voice
    speechRate: 0.90,
    mood: 'playful',
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
    pitch: 1.48, // Calm child boy voice
    speechRate: 0.85,
    mood: 'calm',
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
    pitch: 1.75, // Playful high child girl voice
    speechRate: 0.98,
    mood: 'happy',
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
    mood: 'storytelling',
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
    pitch: 0.78, // Deep adult male teacher voice
    speechRate: 0.85,
    mood: 'calm',
    preferredLanguage: 'fusha_ar',
    color: '#2E7D32',
    staggerDelayMs: 240,
    role: 'teacher',
    gender: 'male'
  }
];

export function getEffectivePitchAndRate(char: ChildCharacter): { pitch: number; rate: number } {
  const mood = MOOD_PRESETS.find((m) => m.id === (char.mood || 'happy')) || MOOD_PRESETS[0];
  const finalPitch = Math.min(2.0, Math.max(0.5, char.pitch + mood.pitchOffset));
  const finalRate = Math.min(1.8, Math.max(0.5, char.speechRate + mood.rateOffset));
  return { pitch: finalPitch, rate: finalRate };
}

export interface TTSDiagnosticInfo {
  timestamp: string;
  inputLanguage: string;
  isArabic: boolean;
  textSnippet: string;
  engine: string;
  voiceUsed: string;
  status: 'playing' | 'success' | 'error';
  httpStatus?: number;
  engineHeader?: string;
  modelHeader?: string;
  audioFormat?: string;
  errorMessage?: string;
}

export class WebStudioSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeTimers: number[] = [];
  private activeAudios: HTMLAudioElement[] = [];
  private isStopped = false;
  private lastDiagnostic: TTSDiagnosticInfo | null = null;
  private diagnosticListeners: ((info: TTSDiagnosticInfo) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public subscribeDiagnostic(listener: (info: TTSDiagnosticInfo) => void) {
    this.diagnosticListeners.push(listener);
    if (this.lastDiagnostic) {
      listener(this.lastDiagnostic);
    }
    return () => {
      this.diagnosticListeners = this.diagnosticListeners.filter((l) => l !== listener);
    };
  }

  public getLatestDiagnostic(): TTSDiagnosticInfo | null {
    return this.lastDiagnostic;
  }

  private updateDiagnostic(info: TTSDiagnosticInfo) {
    this.lastDiagnostic = info;
    this.diagnosticListeners.forEach((listener) => listener(info));
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

  public findBestVoice(dialectId: LanguageDialectId, char: ChildCharacter): SpeechSynthesisVoice | null {
    const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];
    const available = this.getAvailableVoices();

    if (available.length === 0) return null;

    const isArabic = dialectId.includes('ar');
    const femaleKeywords = ['zira', 'laila', 'salma', 'zeina', 'hoda', 'mariam', 'samantha', 'victoria', 'female', 'woman', 'kore', 'yuna'];
    const maleKeywords = ['maged', 'tarik', 'tariq', 'nizar', 'naayf', 'mehdi', 'male', 'man', 'david', 'george', 'alex', 'adam', 'thomas', 'stefan', 'mark'];

    let langVoices = available.filter((v) => {
      const vLang = v.lang.toLowerCase();
      if (isArabic) {
        return vLang.startsWith('ar') || v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('العربية');
      }
      return vLang.startsWith(dialect.localeCode.split('-')[0].toLowerCase());
    });

    if (langVoices.length === 0) {
      if (isArabic) {
        // Strict guard: Do NOT return English system voices like Microsoft David for Arabic text
        return null;
      }
      langVoices = available;
    }

    if (char.gender === 'male') {
      const maleCandidates = langVoices.filter((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw)) ||
        !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (maleCandidates.length > 0) {
        if (char.id === 'char_ali' && maleCandidates.length > 1) {
          return maleCandidates[1];
        }
        return maleCandidates[0];
      }
    } else if (char.gender === 'female') {
      const femaleCandidates = langVoices.filter((v) =>
        femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (femaleCandidates.length > 0) {
        if (char.id === 'char_noor' && femaleCandidates.length > 1) {
          return femaleCandidates[1];
        }
        if (char.id === 'char_sara' && femaleCandidates.length > 2) {
          return femaleCandidates[2];
        }
        return femaleCandidates[0];
      }
    }

    return langVoices[0] || (isArabic ? null : available[0]) || null;
  }

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

    if (this.synth) {
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }

    let completedChars = 0;
    const totalChars = characters.length;

    const handleCharComplete = () => {
      completedChars++;
      if (completedChars >= totalChars && !this.isStopped) {
        onEnd();
      }
    };

    characters.forEach((char, charIndex) => {
      const staggerDelay = charIndex * 40;

      const timerId = window.setTimeout(() => {
        if (this.isStopped) return;
        this.playCharacterSequential(sentences, char, dialectId, isArabic, handleCharComplete);
      }, staggerDelay);

      this.activeTimers.push(timerId);
    });
  }

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

      const bestVoice = this.findBestVoice(dialectId, char);

      // STRICT MANDATE: Arabic MUST NEVER use browser SpeechSynthesis! Route directly to Gemini / Server-Side TTS (/api/tts)
      if (!isArabic && this.synth && 'SpeechSynthesisUtterance' in window && bestVoice !== null) {
        this.speakWithSpeechSynthesis(sentence, char, dialectId, isArabic, bestVoice, () => {
          speakNextSentence();
        });
      } else {
        this.speakWithAudioFallback(sentence, char, dialectId, isArabic, () => {
          speakNextSentence();
        });
      }
    };

    speakNextSentence();
  }

  private speakWithSpeechSynthesis(
    sentence: string,
    char: ChildCharacter,
    dialectId: LanguageDialectId,
    isArabic: boolean,
    bestVoice: SpeechSynthesisVoice | null,
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

      const vocalizedText = isArabic ? enhanceArabicTextForSpeech(sentence) : sentence;
      const utterance = new SpeechSynthesisUtterance(vocalizedText);
      const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = dialect.localeCode;
      }

      const { pitch, rate } = getEffectivePitchAndRate(char);
      utterance.pitch = pitch;
      utterance.rate = rate;

      let hasEnded = false;
      const markNext = () => {
        if (!hasEnded) {
          hasEnded = true;
          onNext();
        }
      };

      utterance.onend = markNext;
      utterance.onerror = (e) => {
        console.warn('Utterance error, switching to audio fallback:', e);
        if (!hasEnded) {
          hasEnded = true;
          this.speakWithAudioFallback(sentence, char, dialectId, isArabic, onNext);
        }
      };

      const watchdog = setTimeout(() => {
        if (!hasEnded) {
          markNext();
        }
      }, Math.max(3500, sentence.length * 120));
      this.activeTimers.push(watchdog as unknown as number);

      this.updateDiagnostic({
        timestamp: new Date().toLocaleTimeString(),
        inputLanguage: dialect.localeCode,
        isArabic: false,
        textSnippet: sentence.slice(0, 40),
        engine: 'Browser SpeechSynthesis',
        voiceUsed: bestVoice ? bestVoice.name : 'Default',
        status: 'playing',
        audioFormat: 'System Audio'
      });

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis exception:', err);
      this.speakWithAudioFallback(sentence, char, dialectId, isArabic, onNext);
    }
  }

  private async speakWithAudioFallback(
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

    const vocalizedText = isArabic ? enhanceArabicTextForSpeech(sentence) : sentence;
    const dialect = LANGUAGE_DIALECTS.find((d) => d.id === dialectId) || LANGUAGE_DIALECTS[0];
    const langCode = isArabic ? dialect.localeCode : dialect.localeCode;
    const encoded = encodeURIComponent(vocalizedText);
    const url = `/api/tts?q=${encoded}&tl=${encodeURIComponent(langCode)}&gender=${char.gender || 'female'}&charId=${char.id}&role=${char.role || 'child'}&pitch=${char.pitch}&rate=${char.speechRate}`;

    this.updateDiagnostic({
      timestamp: new Date().toLocaleTimeString(),
      inputLanguage: langCode,
      isArabic,
      textSnippet: vocalizedText.slice(0, 40),
      engine: 'Gemini Server-Side TTS (/api/tts)',
      voiceUsed: `${char.name} (${char.role === 'teacher' ? (char.gender === 'male' ? 'المعلم' : 'المعلمة') : (char.gender === 'male' ? 'ولد' : 'بنت')})`,
      status: 'playing',
      audioFormat: 'audio/wav / audio/mpeg'
    });

    try {
      const response = await fetch(url);
      const httpStatus = response.status;
      const engineHeader = response.headers.get('X-TTS-Engine') || 'Gemini-TTS';
      const modelHeader = response.headers.get('X-TTS-Model') || 'gemini-2.5-flash';
      const audioFormat = response.headers.get('X-Audio-Format') || response.headers.get('Content-Type') || 'audio/wav';

      if (!response.ok) {
        const errorText = await response.text();
        this.updateDiagnostic({
          timestamp: new Date().toLocaleTimeString(),
          inputLanguage: langCode,
          isArabic,
          textSnippet: vocalizedText.slice(0, 40),
          engine: engineHeader,
          voiceUsed: char.name,
          status: 'error',
          httpStatus,
          engineHeader,
          modelHeader,
          audioFormat,
          errorMessage: errorText || `HTTP ${httpStatus} error`
        });
        onNext();
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;

        const { pitch, rate } = getEffectivePitchAndRate(char);
        let characterPitchScale = 1.0;

        if (char.role === 'teacher') {
          characterPitchScale = char.gender === 'male' ? 0.88 : 0.98;
        } else if (char.gender === 'female') {
          characterPitchScale = 1.22; // High-pitched child girl
        } else {
          characterPitchScale = 1.12; // Youthful child boy
        }

        const effectiveRate = Math.min(1.5, Math.max(0.7, characterPitchScale * (pitch / 1.5) * rate));
        source.playbackRate.value = effectiveRate;

        source.connect(ctx.destination);

        let finished = false;
        const finish = () => {
          if (!finished) {
            finished = true;
            try { source.stop(); } catch (e) {}
            try { ctx.close(); } catch (e) {}
            this.updateDiagnostic({
              timestamp: new Date().toLocaleTimeString(),
              inputLanguage: langCode,
              isArabic,
              textSnippet: vocalizedText.slice(0, 40),
              engine: engineHeader,
              voiceUsed: `${char.name} (${char.arabicName})`,
              status: 'success',
              httpStatus,
              engineHeader,
              modelHeader,
              audioFormat
            });
            onNext();
          }
        };

        source.onended = finish;
        source.start(0);
      } catch (audioCtxErr) {
        // Fallback to standard HTML5 Audio if WebAudio context fails
        console.warn('Web Audio API playback failed, falling back to HTML5 Audio:', audioCtxErr);
        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        audio.crossOrigin = 'anonymous';

        const { rate } = getEffectivePitchAndRate(char);
        audio.playbackRate = Math.min(1.5, Math.max(0.7, rate));

        this.activeAudios.push(audio);

        let finished = false;
        const finish = () => {
          if (!finished) {
            finished = true;
            URL.revokeObjectURL(objectUrl);
            onNext();
          }
        };

        audio.onended = finish;
        audio.onerror = finish;
        await audio.play().catch(finish);
      }
    } catch (e: any) {
      console.error('Audio fallback fetch error:', e);
      this.updateDiagnostic({
        timestamp: new Date().toLocaleTimeString(),
        inputLanguage: langCode,
        isArabic,
        textSnippet: vocalizedText.slice(0, 40),
        engine: 'Gemini Server-Side TTS (/api/tts)',
        voiceUsed: char.name,
        status: 'error',
        errorMessage: e.message || 'Fetch failed'
      });
      onNext();
    }
  }

  public async downloadAudioFile(
    text: string,
    characters: ChildCharacter[],
    dialectId: LanguageDialectId,
    onProgress: (status: string) => void
  ): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText || characters.length === 0) return;

    onProgress('جاري تحضير واستخراج الملف الصوتي (Generating Audio File)...');

    try {
      const isArabic = /[\u0600-\u06FF]/.test(cleanText) || dialectId.includes('ar');
      const sentences = this.splitTextIntoSentences(cleanText);

      interface Chunk {
        buffer: AudioBuffer;
        pitch: number;
        rate: number;
      }
      const chunks: Chunk[] = [];

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      for (const char of characters) {
        const { pitch, rate } = getEffectivePitchAndRate(char);

        for (const sentence of sentences) {
          const vocalizedText = isArabic ? enhanceArabicTextForSpeech(sentence) : sentence;
          const langCode = isArabic ? 'ar' : (dialectId === 'english' ? 'en' : 'ar');
          const encoded = encodeURIComponent(vocalizedText);
          const proxyUrl = `/api/tts?q=${encoded}&tl=${langCode}&gender=${char.gender || 'female'}&charId=${char.id}&role=${char.role || 'child'}&pitch=${char.pitch}&rate=${char.speechRate}`;
          const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encoded}&tl=${langCode}`;

          let decodedBuf: AudioBuffer | null = null;

          // Attempt 1: Fetch via server proxy
          try {
            const resp = await fetch(proxyUrl);
            if (resp.ok) {
              const arrayBuf = await resp.arrayBuffer();
              if (arrayBuf.byteLength > 200) {
                decodedBuf = await ctx.decodeAudioData(arrayBuf);
              }
            }
          } catch (e1) {
            console.warn('Proxy fetch failed:', e1);
          }

          // Attempt 2: Direct Google TTS
          if (!decodedBuf) {
            try {
              const resp = await fetch(directUrl);
              if (resp.ok) {
                const arrayBuf = await resp.arrayBuffer();
                if (arrayBuf.byteLength > 200) {
                  decodedBuf = await ctx.decodeAudioData(arrayBuf);
                }
              }
            } catch (e2) {
              console.warn('Google TTS direct fetch failed:', e2);
            }
          }

          if (decodedBuf) {
            chunks.push({ buffer: decodedBuf, pitch, rate });
          }
        }
      }

      if (chunks.length === 0) {
        onProgress('عذراً، تعذر جلب الملفات الصوتية، يرجى التأكد من الاتصال بالإنترنت والمحاولة مجدداً.');
        return;
      }

      let totalDurationSec = 0;
      chunks.forEach((chunk) => {
        totalDurationSec += chunk.buffer.duration / Math.max(0.5, chunk.rate);
      });

      const sampleRate = chunks[0].buffer.sampleRate || 44100;
      const numOfChannels = chunks[0].buffer.numberOfChannels || 2;
      const totalSamples = Math.max(sampleRate, Math.ceil(totalDurationSec * sampleRate));

      const offlineCtx = new OfflineAudioContext(numOfChannels, totalSamples, sampleRate);

      let offset = 0;
      for (const chunk of chunks) {
        const source = offlineCtx.createBufferSource();
        source.buffer = chunk.buffer;
        source.playbackRate.value = Math.min(1.5, Math.max(0.7, chunk.rate));
        source.connect(offlineCtx.destination);
        source.start(offset);
        offset += chunk.buffer.duration / Math.max(0.5, chunk.rate);
      }

      const renderedBuffer = await offlineCtx.startRendering();

      const wavBlob = this.bufferToWave(renderedBuffer, renderedBuffer.length);
      const url = URL.createObjectURL(wavBlob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `impact-studio-speech-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onProgress('تم تنزيل الملف الصوتي بوضوح ونقاء بنجاح!');
    } catch (err) {
      console.error('Error downloading audio file:', err);
      onProgress('حدث خطأ أثناء تنزيل الصوت.');
    }
  }

  private bufferToWave(abuffer: AudioBuffer, len: number): Blob {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (offset < len) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        const val = sample < 0 ? Math.round(sample * 32768) : Math.round(sample * 32767);
        view.setInt16(pos, val, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  public testArabicVoice(char?: ChildCharacter, onComplete?: () => void) {
    this.stop();
    this.isStopped = false;
    const testChar = char || INITIAL_CHARACTERS[0];
    const text = 'مرحباً، هذا اختبار للصوت العربي.';
    this.speakWithAudioFallback(text, testChar, 'fusha_ar', true, () => {
      if (onComplete) onComplete();
    });
  }

  public runDiagnosticTest(testId: 1 | 2 | 3 | 4 | 5, onStart?: (desc: string) => void, onEnd?: () => void) {
    this.stop();
    this.isStopped = false;
    const testChar = INITIAL_CHARACTERS[0];

    const tests = {
      1: { text: 'Hello, welcome to AI Studio text to speech test.', lang: 'english' as LanguageDialectId, isAr: false, desc: 'Test 1: English TTS' },
      2: { text: 'مرحباً بكم في عالم التعلم وتوليد الصوت العربي.', lang: 'fusha_ar' as LanguageDialectId, isAr: true, desc: 'Test 2: Arabic Gemini TTS' },
      3: { text: 'Bonjour et bienvenue dans notre studio de synthèse vocale.', lang: 'french' as LanguageDialectId, isAr: false, desc: 'Test 3: French TTS' },
      4: { text: 'Hallo und willkommen zum Sprachtest.', lang: 'german' as LanguageDialectId, isAr: false, desc: 'Test 4: German TTS' },
      5: { text: 'مرحباً بكم في Impact Studio - Hello World!', lang: 'fusha_ar' as LanguageDialectId, isAr: true, desc: 'Test 5: Mixed Arabic + English TTS' }
    };

    const item = tests[testId];
    if (onStart) onStart(item.desc);

    if (item.isAr) {
      this.speakWithAudioFallback(item.text, testChar, item.lang, true, () => {
        if (onEnd) onEnd();
      });
    } else {
      const bestVoice = this.findBestVoice(item.lang, testChar);
      if (this.synth && 'SpeechSynthesisUtterance' in window && bestVoice !== null) {
        this.speakWithSpeechSynthesis(item.text, testChar, item.lang, false, bestVoice, () => {
          if (onEnd) onEnd();
        });
      } else {
        this.speakWithAudioFallback(item.text, testChar, item.lang, false, () => {
          if (onEnd) onEnd();
        });
      }
    }
  }

  public stop() {
    this.isStopped = true;

    this.activeTimers.forEach((id) => clearTimeout(id));
    this.activeTimers = [];

    this.activeAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    });
    this.activeAudios = [];

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
