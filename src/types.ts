export type LanguageDialectId = 'gulf_ar' | 'fusha_ar' | 'egyptian_ar' | 'english' | 'french' | 'german';

export type VoiceMood = 'happy' | 'enthusiastic' | 'playful' | 'sad' | 'calm' | 'storytelling';

export interface LanguageDialect {
  id: LanguageDialectId;
  name: string;
  nativeName: string;
  localeCode: string;
  flag: string;
  voiceKeywords: string[];
  sampleText: string;
}

export interface ChildCharacter {
  id: string;
  name: string;
  arabicName: string;
  avatar: string;
  pitch: number; // 0.5 (تخين/عميق) to 2.0 (رفيع/طفولي)
  speechRate: number; // 0.5 (بطيء) to 1.8 (سريع)
  mood?: VoiceMood; // المزاج أو النبرة العاطفية
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




