import React from 'react';
import { Sliders, Sparkles, RotateCcw, HeartHandshake, Gauge, Smile } from 'lucide-react';
import { ChildCharacter, VoiceMood } from '../types';
import { INITIAL_CHARACTERS, MOOD_PRESETS, GEMINI_VOICES, speechEngine } from '../utils/speechSynthesis';

interface CharactersViewProps {
  characters: ChildCharacter[];
  setCharacters: React.Dispatch<React.SetStateAction<ChildCharacter[]>>;
}

export const CharactersView: React.FC<CharactersViewProps> = ({ characters, setCharacters }) => {
  const handlePitchChange = (id: string, newPitch: number) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pitch: parseFloat(newPitch.toFixed(2)) } : c))
    );
  };

  const handleRateChange = (id: string, newRate: number) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, speechRate: parseFloat(newRate.toFixed(2)) } : c))
    );
  };

  const handleMoodChange = (id: string, newMood: VoiceMood) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mood: newMood } : c))
    );
  };

  const handleVoiceChange = (id: string, newVoiceId: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, voiceId: newVoiceId } : c))
    );
  };

  const handleResetDefaults = () => {
    setCharacters(INITIAL_CHARACTERS);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#FFF9C4] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-extrabold text-[#4527A0]">
              إعدادات وبصمة الأصوات للأطفال والمعلمين (Voice Tone & Mood)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            تحكم كامل في نبرة الصوت (رفيع / تخين)، سرعة القراءة، والمزاج الصوتي (حماسي، فرح، حزين، مرح، هادئ، حكواتي).
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFFBF0] hover:bg-amber-100/60 text-[#7B1FA2] text-xs font-extrabold border border-amber-200 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الضبط الافتراضي (Reset Defaults)</span>
        </button>
      </div>

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {characters.map((char) => {
          const isTeacher = char.role === 'teacher';
          const currentMood = char.mood || 'happy';

          return (
            <div
              key={char.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#E1F5FE] shadow-sm space-y-5 transition-all hover:shadow-md"
            >
              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: `${char.color}25` }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-gray-200/60 shadow-xs"
                  >
                    {char.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-[#2D3748] text-base">
                        {char.arabicName} ({char.name})
                      </h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isTeacher ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {isTeacher ? (char.gender === 'female' ? 'معلمة' : 'معلم') : 'طفل'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#7B1FA2]">
                      {isTeacher ? 'صوت شخصية بالغ' : 'صوت شخصية طفل'} #{char.id.replace('char_', '')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    style={{ backgroundColor: char.color, color: '#fff' }}
                    className="text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs uppercase tracking-wide"
                  >
                    {char.pitch >= 1.4 ? 'طفل رفيع' : char.pitch <= 0.9 ? 'عميق / تخين' : 'طبيعي'}
                  </span>
                </div>
              </div>

              {/* Real Voice Identity Dropdown */}
              <div className="space-y-1.5 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center text-xs font-extrabold text-gray-800">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>هوية الصوت الحقيقية (Real TTS Voice):</span>
                  </span>
                  <span className="text-indigo-800 font-extrabold bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[11px]">
                    {char.voiceId || 'Aoede'}
                  </span>
                </div>
                <select
                  value={char.voiceId || 'Aoede'}
                  onChange={(e) => handleVoiceChange(char.id, e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none hover:border-indigo-400 cursor-pointer shadow-2xs"
                >
                  {GEMINI_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - {v.arabicName} ({v.recommendedRole})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pitch Slider (رفيع / تخين) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-gray-800">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>درجة الصوت (رفيع ↔ تخين/عميق)</span>
                  </span>
                  <span className="text-[#7B1FA2] font-black">{char.pitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={char.pitch}
                  onChange={(e) => handlePitchChange(char.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7B1FA2]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold rtl:flex-row-reverse">
                  <span>0.5x (تخين / رجل)</span>
                  <span>1.0x (طبيعي)</span>
                  <span>2.0x (طفل رفيع جداً)</span>
                </div>
              </div>

              {/* Rate / Speed Slider (سرعة الصوت) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-gray-800">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-[#0288D1]" />
                    <span>سرعة النطق والتحدث (Speed)</span>
                  </span>
                  <span className="text-[#0288D1] font-black">{char.speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={char.speechRate}
                  onChange={(e) => handleRateChange(char.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0288D1]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold rtl:flex-row-reverse">
                  <span>0.5x (بطيء جداً)</span>
                  <span>1.0x (طبيعي)</span>
                  <span>1.8x (سريع جداً)</span>
                </div>
              </div>

              {/* Voice Mood Selector (المزاج / نبرة المشاعر) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-extrabold text-gray-800">
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  <span>المزاج الصوتي ونبرة الانفعال (Voice Mood):</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {MOOD_PRESETS.map((m) => {
                    const isSelected = currentMood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleMoodChange(char.id, m.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                          isSelected
                            ? 'bg-[#7B1FA2] text-white border-[#7B1FA2] shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.arabicName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Voice Test Button */}
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    const sampleText = isTeacher
                      ? (char.gender === 'female' ? 'مرحباً بكم يا أبنائي، أنا المعلمة مريم' : 'أهلاً بكم يا طلابي، أنا المعلم أحمد')
                      : `مرحباً بك! أنا ${char.arabicName}، أهلاً بك في الاستوديو`;
                    speechEngine.speakGroupChorus(
                      sampleText,
                      [char],
                      char.preferredLanguage,
                      () => {},
                      () => {}
                    );
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-xl text-xs font-extrabold transition-all border border-green-200 shadow-xs active:scale-95"
                >
                  <span>🔊</span>
                  <span>تجربة الصوت بالتعديل الجديد</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
