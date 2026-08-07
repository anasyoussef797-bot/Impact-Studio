export type LanguageDialectId = 'gulf_ar' | 'fusha_ar' | 'egyptian_ar' | 'english' | 'french' | 'german';

export type VoiceMood = 'happy' | 'enthusiastic' | 'playful' | 'sad' | 'calm' | 'storytelling';

export type TTSProvider = 'gemini' | 'elevenlabs';

export interface LanguageDialect {
  id: LanguageDialectId;
  name: string;
  nativeName: string;
  localeCode: string;
  flag: string;
  voiceKeywords: string[];
  sampleText: string;
}

export interface CharacterVoiceProfile {
  provider: TTSProvider;
  voiceId: string;
  pitch?: number;
  speechRate?: number;
  mood?: VoiceMood;
}

export interface ChildCharacter {
  id: string;
  name: string;
  arabicName: string;
  avatar: string;
  pitch: number; // 0.5 (تخين/عميق) to 2.0 (رفيع/طفولي)
  speechRate: number; // 0.5 (بطيء) to 1.8 (سريع)
  mood?: VoiceMood; // المزاج أو النبرة العاطفية
  provider?: TTSProvider; // Default TTS provider (gemini or elevenlabs)
  voiceId?: string; // Real TTS Voice ID / Name
  languageProfiles?: Partial<Record<LanguageDialectId, CharacterVoiceProfile>>;
  preferredLanguage: LanguageDialectId;
  color: string;
  staggerDelayMs: number; // for chorus offset
  role?: 'child' | 'teacher';
  gender?: 'female' | 'male';
}

export interface StudioSettings {
  defaultLanguage: LanguageDialectId;
  requestFocus: boolean;
  chorusDelayMs: number;
  autoClearText: boolean;
  fallbackToGemini?: boolean; // Fallback to Gemini if ElevenLabs fails
}

export interface ElevenLabsVoiceInfo {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  labels?: {
    gender?: string;
    accent?: string;
    age?: string;
    use_case?: string;
    description?: string;
    language?: string;
    [key: string]: string | undefined;
  };
  preview_url?: string;
}


export interface DialogueLine {
  id: string;
  characterId: string;
  text: string;
  mood?: VoiceMood;
}

export interface AudioHistoryItem {
  id: string;
  timestamp: string;
  characterName: string;
  characterAvatar: string;
  textSnippet: string;
  dialectName: string;
  audioBlobUrl: string;
  audioBuffer?: ArrayBuffer;
}

export type StudioAudioEffect = 'none' | 'studio' | 'radio' | 'reverb' | 'warm_eq';

export interface AndroidFile {
  filename: string;
  path: string;
  code: string;
  language?: string;
  category: string;
}




