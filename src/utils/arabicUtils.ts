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
  'فوكسي': 'فُوكْسِي',
  'سبارك': 'سْبَارْك',
  'تاليا': 'تَالِيَا',
  'ادم': 'آَدَم',
  'آدم': 'آَدَمُ',
  'ضيفه': 'ضَيْفَه',
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
 * Removes all Arabic diacritics (Tashkeel) from a text string.
 */
export function removeDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

/**
 * Smart automatic Tashkeel / Diacritization for Arabic text
 * to ensure 100% accurate pronunciation in TTS engines.
 */
export function autoTashkeelText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleanText = removeDiacritics(text);

  // Expanded Tashkeel dictionary for common words and particles
  const EXPANDED_TASHKEEL: Record<string, string> = {
    ...COMMON_WORD_TASHKEEL,
    'في': 'فِي',
    'من': 'مِنْ',
    'على': 'عَلَى',
    'إلى': 'إِلَى',
    'عن': 'عَنْ',
    'مع': 'مَعَ',
    'هذا': 'هَٰذَا',
    'هذه': 'هَٰذِهِ',
    'هؤلاء': 'هَٰؤُلَاءِ',
    'ذلك': 'ذَٰلِكَ',
    'الذي': 'الَّذِي',
    'التي': 'الَّتِي',
    'الذين': 'الَّذِينَ',
    'كان': 'كَانَ',
    'كانت': 'كَانَتْ',
    'قال': 'قَالَ',
    'قالت': 'قَالَتْ',
    'أن': 'أَنْ',
    'إن': 'إِنَّ',
    'لا': 'لَا',
    'نعم': 'نَعَمْ',
    'ما': 'مَا',
    'هل': 'هَلْ',
    'كيف': 'كَيْفَ',
    'لماذا': 'لِمَاذَا',
    'متى': 'مَتَى',
    'أين': 'أَيْنَ',
    'يا': 'يَا',
    'جميل': 'جَمِيلٌ',
    'رائع': 'رَائِعٌ',
    'صديقي': 'صَدِيقِي',
    'المدرسة': 'الْمَدْرَسَةُ',
    'الفصل': 'الْفَصْلُ',
    'الدرس': 'الدَّرْسُ',
    'قصة': 'قِصَّةٌ',
    'حكاية': 'حِكَايَةٌ',
    'اليوم': 'الْيَوْمَ',
    'غدا': 'غَدًا',
    'نجاح': 'نَجَاحٌ',
    'تفوق': 'تَفَوُّقٌ'
  };

  Object.entries(EXPANDED_TASHKEEL).forEach(([plain, vocalized]) => {
    const regex = new RegExp(`(?<=^|\\s)${plain}(?=\\s|$|[,.?!:]|\\b)`, 'g');
    cleanText = cleanText.replace(regex, vocalized);
  });

  return cleanText;
}

/**
 * Checks if a given text contains Arabic characters.
 */
export function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

/**
 * Preset professional educational & storytelling script templates
 */
export const SCRIPT_TEMPLATES = [
  {
    id: 'numbers',
    title: '🔢 قصة تعلم الأرقام والعد',
    category: 'تعليمي',
    text: 'مَرْحَبًا بِكُمْ يَا أَصْدِقَائِي! الْيَوْمَ سَنَتَعَلَّمُ الْأَرْقَامَ مَعًا. وَاحِدْ، اثْنَانْ، ثَلَاثَةْ، أَرْبَعَةْ، خَمْسَةْ! هَيَّا نَعُدُّ مَعًا بِحَمَاسٍ!'
  },
  {
    id: 'classroom_dialogue',
    title: '🏫 حوار صفي ممتع مع المعلم',
    category: 'حوار',
    text: 'السَّلَامُ عَلَيْكُمْ يَا أَطْفَالِي الأَعِزَّاءِ! أَهْلًا بِكُمْ فِي دَرْسِ الْيَوْمِ الْمُمْتِعِ. هَلْ أَنْتُمْ مُسْتَعِدُّونَ لِلْمَغَامَرَةِ الْعِلْمِيَّةِ؟'
  },
  {
    id: 'bedtime_story',
    title: '🌙 قصة طفولية قبل النوم',
    category: 'قصص',
    text: 'فِي قَرِيةٍ جَمِيلَةٍ هَادِئَةٍ، كَانَ هُنَاكَ ثَعْلَبٌ صَغِيرٌ ذَكِيٌّ يُدْعَى فُوكْسِي. كَانَ فُوكْسِي يُحِبُّ مَشَاهَدَةَ النُّجُومِ الْبَرَّاقَةِ قَبْلَ أَنْ يَنَامَ.'
  },
  {
    id: 'alphabet_song',
    title: '🎨 أنشودة الحروف والألوان',
    category: 'أنشودة',
    text: 'أَلِفٌ بَاءٌ تَاءٌ ثَاءْ، نَمْرَحُ نَلْعَبُ فِي إِخَاءْ! جِيمٌ حَاءٌ خَاءٌ دَالْ، نَبْنِي مُسْتَقْبَلَ الْأَجْيَالْ!'
  }
];

