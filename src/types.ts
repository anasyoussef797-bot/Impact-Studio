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

export interface AndroidFile {
  path: string;
  filename: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'res';
  code: string;
}
