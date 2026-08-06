/**
 * Utility functions for Arabic text processing and vocalization (Tashkeel)
 * to ensure correct pronunciation in speech engines.
 */

// Basic diacritization map for common words to ensure accurate Arabic speech synthesis
const COMMON_WORD_TASHKEEL: Record<string, string> = {
  'مرحبا': 'مَرْحَبًا',
  'مرحبا بكم': 'مَرْحَبًا بِكُمْ',
  'اهلاً': 'أَهْلًا',
  'اهلاً بكم': 'أَهْلًا بِكُمْ',
  'السلام عليكم': 'السَّلَامُ عَلَيْكُمْ',
  'شكرا': 'شُكْرًا',
  'اطفال': 'أَطْفَال',
  'الاطفال': 'الْأَطْفَال',
  'اطفالي': 'أَطْفَالِي',
  'يا اطفال': 'يَا أَطْفَالُ',
  'يا اصحابي': 'يَا أَصْحَابِي',
  'معلم': 'مُعَلِّم',
  'المعلم': 'الْمُعَلِّم',
  'معلمة': 'مُعَلِّمَة',
  'المعلمة': 'الْمُعَلِّمَة',
  'استديو': 'إِمْبَاكْت سْتُودْيُو',
  'تطبيق': 'تَطْبِيق',
  'صوت': 'صَوْت',
  'صوتي': 'صَوْتِي',
  'لولو': 'لُولُو',
  'راشد': 'رَاشِد',
  'نور': 'نُور',
  'علي': 'عَلِيّ',
  'سارة': 'سَارَة',
  'مريم': 'مَرْيَم',
  'احمد': 'أَحْمَد'
};

/**
 * Enhances Arabic text with basic diacritics and correct phonetic markers
 * so Web Speech and TTS engines pronounce words correctly.
 */
export function enhanceArabicTextForSpeech(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let processed = text;

  // Replace common words with vocalized versions if not already vocalized
  Object.entries(COMMON_WORD_TASHKEEL).forEach(([plain, vocalized]) => {
    const regex = new RegExp(`\\b${plain}\\b`, 'gi');
    processed = processed.replace(regex, vocalized);
  });

  return processed;
}

/**
 * Checks if a given text contains Arabic characters.
 */
export function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}
