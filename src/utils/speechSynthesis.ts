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
    pitch: 1.28, // Clear, cute young girl child voice
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
    pitch: 1.20, // Energetic young boy child voice
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
    pitch: 1.32, // Bright little kid girl voice
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
    pitch: 1.15, // Calm young boy voice
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
    pitch: 1.25, // Playful child girl voice
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
    pitch: 0.75, // Deep adult male teacher voice
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
  private audioCtx: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

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
    const femaleKeywords = ['zira', 'laila', 'salma', 'zeina', 'hoda', 'mariam', 'samantha', 'victoria', 'female', 'woman', 'kore', 'yuna', 'tarik_female'];
    const maleKeywords = ['maged', 'tarik', 'tariq', 'nizar', 'naayf', 'mehdi', 'male', 'man', 'david', 'george', 'alex', 'adam', 'thomas', 'stefan', 'mark'];

    // Filter by language prefix
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

    if (gender === 'male') {
      // Find a voice containing explicit male keywords
      const explicitMale = langVoices.find((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (explicitMale) return explicitMale;

      // Filter out female voices to avoid using female voice for Mr. Ahmed
      const maleCandidates = langVoices.filter(
        (v) => !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (maleCandidates.length > 0) return maleCandidates[0];
    } else if (gender === 'female') {
      const explicitFemale = langVoices.find((v) =>
        femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      if (explicitFemale) return explicitFemale;
    }

    return langVoices[0] || available[0] || null;
  }

  /**
   * Split text into clean short sentences (max 120 chars) for stable TTS execution
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
   * Main speech function for single character or group chorus
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

    // Ensure SpeechSynthesis is active on Vercel/Chrome
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
      const staggerDelay = charIndex * 40; // Staggered chorus

      const timerId = window.setTimeout(() => {
        if (this.isStopped) return;
        this.playCharacterSequential(sentences, char, dialectId, isArabic, handleCharComplete);
      }, staggerDelay);

      this.activeTimers.push(timerId);
    });
  }

  /**
   * Play character speech sequentially sentence by sentence
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

      // Priority 1: Native Web Speech API
      if (this.synth && 'SpeechSynthesisUtterance' in window) {
        this.speakWithSpeechSynthesis(sentence, char, dialectId, isArabic, () => {
          speakNextSentence();
        });
      } else {
        // Priority 2: Online Audio Fallback
        this.speakWithAudioFallback(sentence, char, dialectId, isArabic, () => {
          speakNextSentence();
        });
      }
    };

    speakNextSentence();
  }

  /**
   * Speak sentence using native Web Speech API with unstick handling
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

      // Find gender-matched voice
      const bestVoice = this.findBestVoice(dialectId, char.gender);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = isArabic ? 'ar-SA' : dialect.localeCode;
      }

      // Precise non-distorted pitch settings
      utterance.pitch = Math.min(1.40, Math.max(0.65, char.pitch));
      utterance.rate = Math.min(1.2, Math.max(0.75, char.speechRate));

      let hasEnded = false;
      const markNext = () => {
        if (!hasEnded) {
          hasEnded = true;
          onNext();
        }
      };

      utterance.onend = markNext;
      utterance.onerror = (e) => {
        console.warn('Utterance failed on browser, switching to audio fallback:', e);
        if (!hasEnded) {
          hasEnded = true;
          this.speakWithAudioFallback(sentence, char, dialectId, isArabic, onNext);
        }
      };

      // Watchdog timer to unstick browser if speech hangs
      const watchdog = setTimeout(() => {
        if (!hasEnded) {
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
   * Fallback using online Audio stream with custom pitch
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

      // Adjust playback rate for teacher vs child
      if (char.role === 'teacher' && char.gender === 'male') {
        audio.playbackRate = 0.85; // Deep male teacher
      } else if (char.role === 'teacher' && char.gender === 'female') {
        audio.playbackRate = 1.0; // Normal female teacher
      } else {
        // Child voices: slight pitch shift without distortion
        audio.playbackRate = Math.min(1.25, Math.max(0.9, char.pitch));
      }

      this.activeAudios.push(audio);

      let finished = false;
      const finish = () => {
        if (!finished) {
          finished = true;
          onNext();
        }
      };

      audio.onended = finish;
      audio.onerror = finish;

      audio.play().catch(() => finish());
    } catch (e) {
      console.error('Audio fallback error:', e);
      onNext();
    }
  }

  /**
   * Export / Download Speech as MP3/WAV file
   */
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
      const audioBuffers: AudioBuffer[] = [];

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      for (const char of characters) {
        for (const sentence of sentences) {
          const langCode = isArabic ? 'ar' : (dialectId === 'english' ? 'en' : 'ar');
          const encoded = encodeURIComponent(sentence);
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encoded}&tl=${langCode}`;

          try {
            const resp = await fetch(ttsUrl);
            const arrayBuf = await resp.arrayBuffer();
            const decodedBuf = await ctx.decodeAudioData(arrayBuf);
            audioBuffers.push(decodedBuf);
          } catch (e) {
            console.warn('Could not fetch TTS audio chunk for download:', e);
          }
        }
      }

      if (audioBuffers.length === 0) {
        onProgress('عذراً، تعذر دمج الصوت، يرجى المحاولة مرة أخرى.');
        return;
      }

      // Calculate total audio duration
      const totalSamples = audioBuffers.reduce((acc, buf) => acc + buf.length, 0);
      const sampleRate = audioBuffers[0].sampleRate;
      const offlineCtx = new OfflineAudioContext(1, totalSamples, sampleRate);

      let offset = 0;
      for (const buf of audioBuffers) {
        const source = offlineCtx.createBufferSource();
        source.buffer = buf;
        source.connect(offlineCtx.destination);
        source.start(offset);
        offset += buf.duration;
      }

      const renderedBuffer = await offlineCtx.startRendering();

      // Convert AudioBuffer to WAV Blob
      const wavBlob = this.bufferToWave(renderedBuffer, totalSamples);
      const url = URL.createObjectURL(wavBlob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `impact-studio-speech-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onProgress('تم تنزيل الملف الصوتي بنجاح! (Downloaded Successfully)');
    } catch (err) {
      console.error('Error downloading audio file:', err);
      onProgress('حدث خطأ أثناء تنزيل الصوت.');
    }
  }

  /**
   * Helper to encode AudioBuffer to downloadable WAV Blob
   */
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
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * Stop all active speech
   */
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
