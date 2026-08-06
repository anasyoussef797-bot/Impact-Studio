export type LanguageDialectId = 'gulf_ar' | 'fusha_ar' | 'egyptian_ar' | 'english' | 'french' | 'german';

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
  pitch: number; // e.g. 1.5f for children, 0.85f for adult male
  speechRate: number; // e.g. 0.8f
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
