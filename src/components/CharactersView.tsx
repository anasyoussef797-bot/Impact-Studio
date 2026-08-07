import React, { useState } from 'react';
import { Sliders, Sparkles, RotateCcw, Gauge, Smile, Globe, Settings2, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { ChildCharacter, VoiceMood, TTSProvider, LanguageDialectId, ElevenLabsVoiceInfo } from '../types';
import { INITIAL_CHARACTERS, MOOD_PRESETS, GEMINI_VOICES, LANGUAGE_DIALECTS, speechEngine } from '../utils/speechSynthesis';
import { ElevenLabsVoicePicker } from './ElevenLabsVoicePicker';

interface CharactersViewProps {
  characters: ChildCharacter[];
  setCharacters: React.Dispatch<React.SetStateAction<ChildCharacter[]>>;
}

export const CharactersView: React.FC<CharactersViewProps> = ({ characters, setCharacters }) => {
  const [activePickerCharId, setActivePickerCharId] = useState<string | null>(null);
  const [activePickerDialect, setActivePickerDialect] = useState<LanguageDialectId | 'default'>('default');
  const [expandedMultilingual, setExpandedMultilingual] = useState<Record<string, boolean>>({});

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

  const handleProviderChange = (id: string, provider: TTSProvider) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const defaultVoice = provider === 'gemini' ? (c.gender === 'male' ? 'Puck' : 'Aoede') : '21m00Tcm4TlvDq8ikWAM';
        return {
          ...c,
          provider,
          voiceId: defaultVoice
        };
      })
    );
  };

  const handleVoiceChange = (id: string, newVoiceId: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, voiceId: newVoiceId } : c))
    );
  };

  const handleLangProfileChange = (
    charId: string,
    dialectId: LanguageDialectId,
    provider: TTSProvider,
    voiceId: string
  ) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== charId) return c;
        const updatedProfiles = { ...(c.languageProfiles || {}) };
        updatedProfiles[dialectId] = { provider, voiceId };
        return { ...c, languageProfiles: updatedProfiles };
      })
    );
  };

  const handleResetDefaults = () => {
    setCharacters(INITIAL_CHARACTERS);
  };

  const toggleMultilingual = (charId: string) => {
    setExpandedMultilingual((prev) => ({ ...prev, [charId]: !prev[charId] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* ElevenLabs Picker Modal */}
      {activePickerCharId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <ElevenLabsVoicePicker
            selectedVoiceId={
              activePickerDialect === 'default'
                ? characters.find((c) => c.id === activePickerCharId)?.voiceId
                : characters.find((c) => c.id === activePickerCharId)?.languageProfiles?.[activePickerDialect]?.voiceId
            }
            onSelectVoice={(voice: ElevenLabsVoiceInfo) => {
              if (activePickerDialect === 'default') {
                handleVoiceChange(activePickerCharId, voice.voice_id);
              } else {
                const char = characters.find((c) => c.id === activePickerCharId);
                const currentProv = char?.languageProfiles?.[activePickerDialect]?.provider || 'elevenlabs';
                handleLangProfileChange(activePickerCharId, activePickerDialect, currentProv, voice.voice_id);
              }
              setActivePickerCharId(null);
            }}
            onClose={() => setActivePickerCharId(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#FFF9C4] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-extrabold text-[#4527A0]">
              إعدادات محركات وبصمة الأصوات (Gemini & ElevenLabs TTS)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            اختر محرك الصوت (Gemini أو ElevenLabs)، وخصص بصمة الصوت حسب الشخصية واللغة، مع التحكم بالنبرة والسرعة والمزاج.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFFBF0] hover:bg-amber-100/60 text-[#7B1FA2] text-xs font-extrabold border border-amber-200 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الضبط الافتراضي</span>
        </button>
      </div>

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {characters.map((char) => {
          const isTeacher = char.role === 'teacher';
          const currentMood = char.mood || 'happy';
          const currentProvider: TTSProvider = char.provider || 'gemini';
          const isMultilingualExpanded = expandedMultilingual[char.id] || false;

          return (
            <div
              key={char.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#E1F5FE] shadow-sm space-y-5 transition-all hover:shadow-md"
            >
              {/* Card Header */}
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
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isTeacher ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
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

              {/* TTS Engine Selector (Gemini vs ElevenLabs) */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-purple-600" />
                  <span>مزود محرك الصوت (TTS Provider):</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProviderChange(char.id, 'gemini')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                      currentProvider === 'gemini'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'
                    }`}
                  >
                    <span>🔮</span>
                    <span>Gemini TTS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange(char.id, 'elevenlabs')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                      currentProvider === 'elevenlabs'
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    <span>⚡</span>
                    <span>ElevenLabs AI</span>
                  </button>
                </div>
              </div>

              {/* Voice Identity Picker based on provider */}
              <div className="space-y-1.5 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center text-xs font-extrabold text-gray-800">
                  <span className="flex items-center gap-1.5 text-indigo-800">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      هوية الصوت الحقيقية ({currentProvider === 'elevenlabs' ? 'ElevenLabs' : 'Gemini'}):
                    </span>
                  </span>
                  <span className="text-indigo-900 font-extrabold bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[11px] truncate max-w-[140px]">
                    {char.voiceId || (currentProvider === 'elevenlabs' ? 'Default' : 'Aoede')}
                  </span>
                </div>

                {currentProvider === 'gemini' ? (
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
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={char.voiceId || ''}
                        onChange={(e) => handleVoiceChange(char.id, e.target.value)}
                        placeholder="أدخل ElevenLabs Voice ID..."
                        className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setActivePickerCharId(char.id);
                          setActivePickerDialect('default');
                        }}
                        className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>🎙️</span>
                        <span>مكتبة الأصوات</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pitch Slider */}
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
                  <span>2.0x (طفل رفيع)</span>
                </div>
              </div>

              {/* Speech Speed Slider */}
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
              </div>

              {/* Voice Mood Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-extrabold text-gray-800">
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  <span>المزاج الصوتي ونبرة الانفعال:</span>
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
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.arabicName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multilingual Voice Profiles Accordion */}
              <div className="border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => toggleMultilingual(char.id)}
                  className="w-full flex items-center justify-between text-xs font-extrabold text-purple-800 bg-purple-50 hover:bg-purple-100/80 p-2.5 rounded-2xl border border-purple-200 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span>تخصيص أصوات اللغات المتعددة (Multilingual Voices)</span>
                  </span>
                  {isMultilingualExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isMultilingualExpanded && (
                  <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs">
                    <p className="text-[11px] text-gray-500">
                      يمكنك ربط صوت ومحرك محدد (مثلاً ElevenLabs للعربية و Gemini للإنجليزية) لكل لغة على حدة:
                    </p>

                    {LANGUAGE_DIALECTS.map((dialect) => {
                      const profile = char.languageProfiles?.[dialect.id];
                      const dProvider = profile?.provider || currentProvider;
                      const dVoice = profile?.voiceId || char.voiceId || '';

                      return (
                        <div key={dialect.id} className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between font-extrabold text-gray-800">
                            <span className="flex items-center gap-1.5">
                              <span>{dialect.flag}</span>
                              <span>{dialect.nativeName}</span>
                            </span>
                            <span className="text-[10px] text-purple-700 font-bold">
                              {dProvider === 'elevenlabs' ? 'ElevenLabs' : 'Gemini'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={dProvider}
                              onChange={(e) =>
                                handleLangProfileChange(
                                  char.id,
                                  dialect.id,
                                  e.target.value as TTSProvider,
                                  dVoice
                                )
                              }
                              className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 font-bold text-xs"
                            >
                              <option value="gemini">🔮 Gemini</option>
                              <option value="elevenlabs">⚡ ElevenLabs</option>
                            </select>

                            {dProvider === 'gemini' ? (
                              <select
                                value={dVoice || 'Aoede'}
                                onChange={(e) =>
                                  handleLangProfileChange(char.id, dialect.id, 'gemini', e.target.value)
                                }
                                className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 font-bold text-xs"
                              >
                                {GEMINI_VOICES.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePickerCharId(char.id);
                                  setActivePickerDialect(dialect.id);
                                }}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg p-1.5 font-extrabold text-xs text-center truncate"
                              >
                                {dVoice ? `صوت: ${dVoice.slice(0, 8)}...` : 'اختر صوتاً'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Voice Test Button */}
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    const sampleText = isTeacher
                      ? char.gender === 'female'
                        ? 'مرحباً بكم يا أبنائي، أنا المعلمة مريم'
                        : 'أهلاً بكم يا طلابي، أنا المعلم أحمد'
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
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تجربة الصوت بالتعديل الحالي</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
