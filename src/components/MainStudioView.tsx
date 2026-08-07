import React, { useState } from 'react';
import { Play, Square, Users, Download, Sparkles, RefreshCw, Sliders, Gauge, Smile, Volume2, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { ChildCharacter, LanguageDialectId, VoiceMood } from '../types';
import { LANGUAGE_DIALECTS, MOOD_PRESETS, speechEngine } from '../utils/speechSynthesis';
import { DiagnosticPanel } from './DiagnosticPanel';

interface MainStudioViewProps {
  characters: ChildCharacter[];
  setCharacters: React.Dispatch<React.SetStateAction<ChildCharacter[]>>;
}

export const MainStudioView: React.FC<MainStudioViewProps> = ({ characters, setCharacters }) => {
  const [selectedDialect, setSelectedDialect] = useState<LanguageDialectId>('gulf_ar');
  const [scriptText, setScriptText] = useState<string>(
    LANGUAGE_DIALECTS[0].sampleText
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeControlCharId, setActiveControlCharId] = useState<string>(characters[0].id);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  const currentDialectObj = LANGUAGE_DIALECTS.find((d) => d.id === selectedDialect) || LANGUAGE_DIALECTS[0];

  const handleDialectChange = (dialectId: LanguageDialectId) => {
    setSelectedDialect(dialectId);
    const newObj = LANGUAGE_DIALECTS.find((d) => d.id === dialectId);
    if (newObj) {
      setScriptText(newObj.sampleText);
    }
  };

  const toggleCharacterSelection = (id: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSelected: !c.isSelected } : c))
    );
    setActiveControlCharId(id);
  };

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

  const selectedCharacters = characters.filter((c) => c.isSelected);
  const activeChar = characters.find((c) => c.id === activeControlCharId) || characters[0];

  const handlePlay = () => {
    if (isSpeaking) {
      speechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    const charsToSpeak = selectedCharacters.length > 0 ? selectedCharacters : [activeChar];

    speechEngine.speakGroupChorus(
      scriptText,
      charsToSpeak,
      selectedDialect,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleTestArabicVoice = () => {
    setIsSpeaking(true);
    speechEngine.testArabicVoice(activeChar, () => {
      setIsSpeaking(false);
    });
  };

  const handleDownload = async () => {
    if (isDownloading || !scriptText.trim()) return;

    setIsDownloading(true);
    setDownloadStatus('جاري جلب ومعالجة الصوت وتصديره كملف صوتی...');

    const charsToSpeak = selectedCharacters.length > 0 ? selectedCharacters : [activeChar];

    await speechEngine.downloadAudioFile(
      scriptText,
      charsToSpeak,
      selectedDialect,
      (statusMsg) => {
        setDownloadStatus(statusMsg);
        setTimeout(() => setDownloadStatus(null), 4000);
      }
    );

    setIsDownloading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

      {/* Top Banner with Quick Test Arabic Voice & Diagnostics Toggle */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xl border border-amber-400/30">
            ✨
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>محرك تحويل النص إلى صوت (Gemini Arabic TTS Engine)</span>
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black rounded-full uppercase border border-amber-400/30">
                Server API Ready
              </span>
            </h2>
            <p className="text-xs text-purple-200">
              توليد صوت عربي حقيقي عبر نموذج Gemini API مباشرة دون الاعتماد على أصوات المتصفح المحلية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleTestArabicVoice}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-900/30 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>اختبار الصوت العربي (Test Arabic Voice)</span>
          </button>

          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-purple-300" />
            <span className="hidden md:inline">لوحة التشخيص</span>
            {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Developer Diagnostics Panel (Collapsible) */}
      {showDiagnostics && (
        <div className="animate-fade-in">
          <DiagnosticPanel />
        </div>
      )}

      {/* Script Input Box */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#E1F5FE] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="px-3 py-1 bg-[#E0F7FA] text-[#00838F] rounded-xl text-xs font-extrabold uppercase tracking-wide">
              محرر النص
            </span>
            <span className="text-gray-400 text-xs font-semibold">
              | {selectedCharacters.length > 0 ? `${selectedCharacters.map(c => c.arabicName).join('، ')}` : activeChar.arabicName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDialect}
              onChange={(e) => handleDialectChange(e.target.value as LanguageDialectId)}
              className="bg-[#F5F5F5] border-none rounded-xl text-xs font-bold px-3 py-2 text-[#4527A0] outline-none cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {LANGUAGE_DIALECTS.map((dialect) => (
                <option key={dialect.id} value={dialect.id}>
                  {dialect.flag} {dialect.nativeName} ({dialect.name})
                </option>
              ))}
            </select>

            <button
              onClick={() => setScriptText(currentDialectObj.sampleText)}
              className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-100 flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>نص تجريبي</span>
            </button>
          </div>
        </div>

        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          rows={5}
          placeholder="اكتب النص هنا ليقوم الأطفال بنطقه..."
          className="w-full text-xl font-medium leading-relaxed text-gray-800 bg-transparent resize-none outline-none placeholder-gray-300 transition-all"
          dir="auto"
        />

        <div className="pt-3 flex items-center justify-between border-t border-gray-100 text-xs text-gray-400">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setScriptText('')}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-medium border border-gray-100 transition-all"
            >
              مسح النص (Clear)
            </button>
          </div>
          <p className="font-semibold text-[#7B1FA2]">
            {scriptText.length} حرف | {currentDialectObj.nativeName}
          </p>
        </div>
      </div>

      {/* Voice Characters Roster */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#F1F8E9] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-[#81C784]" />
            <span>اختر الشخصيات للنطق المتزامن (Voice Selection)</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">الكورال المحدد:</span>
            <span className="px-2.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-extrabold border border-green-200">
              {selectedCharacters.length} / {characters.length} شخصية
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {characters.map((char) => {
            const isSelected = char.isSelected;
            const isTeacher = char.role === 'teacher';
            const isActiveForControls = char.id === activeControlCharId;

            return (
              <div
                key={char.id}
                onClick={() => toggleCharacterSelection(char.id)}
                className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all border-2 text-center relative ${
                  isActiveForControls ? 'ring-2 ring-purple-400' : ''
                } ${
                  isSelected
                    ? isTeacher
                      ? 'bg-[#F3E5F5] border-[#AB47BC] shadow-sm transform scale-102'
                      : 'bg-[#E1F5FE] border-[#4FC3F7] shadow-sm transform scale-102'
                    : 'bg-white hover:bg-gray-50 border-gray-100 opacity-80 hover:opacity-100'
                }`}
              >
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1 ${
                  isTeacher ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {isTeacher ? (char.gender === 'female' ? 'معلمة' : 'معلم') : 'طفل'}
                </span>
                <div className="text-3xl mb-1">{char.avatar}</div>
                <span className={`text-xs font-extrabold truncate w-full ${
                  isSelected ? (isTeacher ? 'text-[#7B1FA2]' : 'text-[#0288D1]') : 'text-gray-700'
                }`}>
                  {char.arabicName}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold truncate w-full">{char.name}</span>
                <span className="text-[9px] font-bold text-gray-500 mt-0.5">{char.pitch}x Pitch</span>
                {isSelected && (
                  <div className={`w-2 h-2 rounded-full mt-1 animate-pulse ${isTeacher ? 'bg-[#7B1FA2]' : 'bg-[#0288D1]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Control Panel (أدوات التحكم في الصوت مباشرة في الصفحة الرئيسية) */}
      <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-3xl p-6 shadow-sm border-2 border-purple-200 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: `${activeChar.color}25` }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl border border-purple-200"
            >
              {activeChar.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#4527A0] text-base">
                  أدوات ضبط الصوت للشخصية: {activeChar.arabicName} ({activeChar.name})
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {activeChar.role === 'teacher' ? 'معلم' : 'صوت طفل'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                عدّل طبقة الصوت، سرعة التحدث، والمزاج الصوتي مباشرة وسيتم حفظ التعديلات فوراً.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const sampleText = activeChar.role === 'teacher'
                ? (activeChar.gender === 'female' ? 'مرحباً بكم، أنا المعلمة مريم' : 'أهلاً بكم، أنا المعلم أحمد')
                : `مرحباً بك! أنا ${activeChar.arabicName}`;
              speechEngine.speakGroupChorus(
                sampleText,
                [activeChar],
                selectedDialect,
                () => {},
                () => {}
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-xl text-xs font-bold transition-all border border-green-200 shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-green-700" />
            <span>تجربة هذا الصوت (Test)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pitch Control (درجة الصوت: رفيع ↔ تخين) */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-purple-100">
            <div className="flex justify-between text-xs font-extrabold text-gray-800">
              <span className="flex items-center gap-1 text-[#7B1FA2]">
                <Sliders className="w-4 h-4" />
                <span>درجة الصوت (رفيع ↔ تخين / pitch)</span>
              </span>
              <span className="text-[#7B1FA2] font-black text-sm">{activeChar.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={activeChar.pitch}
              onChange={(e) => handlePitchChange(activeChar.id, parseFloat(e.target.value))}
              className="w-full h-2.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7B1FA2]"
            />
            <div className="flex justify-between text-[11px] text-gray-500 font-bold rtl:flex-row-reverse">
              <span>0.5x (تخين / عميق)</span>
              <span>1.0x (طبيعي)</span>
              <span>2.0x (رفيع / طفولي)</span>
            </div>
          </div>

          {/* Rate/Speed Control (سرعة الصوت) */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-sky-100">
            <div className="flex justify-between text-xs font-extrabold text-gray-800">
              <span className="flex items-center gap-1 text-[#0288D1]">
                <Gauge className="w-4 h-4" />
                <span>سرعة النطق (Speed / Rate)</span>
              </span>
              <span className="text-[#0288D1] font-black text-sm">{activeChar.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={activeChar.speechRate}
              onChange={(e) => handleRateChange(activeChar.id, parseFloat(e.target.value))}
              className="w-full h-2.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0288D1]"
            />
            <div className="flex justify-between text-[11px] text-gray-500 font-bold rtl:flex-row-reverse">
              <span>0.5x (بطيء جداً)</span>
              <span>1.0x (طبيعي)</span>
              <span>1.8x (سريع جداً)</span>
            </div>
          </div>
        </div>

        {/* Mood Preset Control (المزاج الانفعالي) */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 mb-1">
            <Smile className="w-4 h-4 text-amber-500" />
            <span>المزاج الصوتي والمشاعر (Voice Emotion & Mood):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {MOOD_PRESETS.map((m) => {
              const isSelected = (activeChar.mood || 'happy') === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMoodChange(activeChar.id, m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-[#7B1FA2] text-white border-[#7B1FA2] shadow-sm transform scale-102'
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
      </div>

      {/* Waveform Visualizer Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-[#F3E5F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${isSpeaking ? 'bg-[#FF7043] animate-ping' : 'bg-[#81C784]'}`} />
          <div>
            <span className="text-xs font-extrabold text-[#7B1FA2] block">
              {isSpeaking ? 'Playback Active (Chorus Live)' : 'Studio Standby'}
            </span>
            <span className="text-[10px] text-gray-500">
              {isSpeaking ? `Voices: ${selectedCharacters.map(c => c.arabicName).join(', ') || activeChar.arabicName}` : 'اضغط تشغيل الصوت للبدء'}
            </span>
          </div>
        </div>

        {/* Waveform bars */}
        <div className="flex items-center gap-1 h-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isSpeaking ? 'bg-[#FF7043] animate-pulse' : 'bg-[#CE93D8] h-2'
              }`}
              style={{
                height: isSpeaking ? `${Math.max(8, (i * 7) % 28)}px` : '8px',
                animationDelay: `${i * 60}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Play Speech & Download CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={handlePlay}
          className={`w-full sm:w-auto px-10 py-5 bg-[#FF7043] hover:bg-[#F4511E] rounded-3xl shadow-lg shadow-orange-200 flex items-center justify-center space-x-3 rtl:space-x-reverse transition-all transform hover:scale-[1.02] active:scale-95 text-white ${
            isSpeaking ? 'bg-[#D32F2F] hover:bg-[#C2185B] shadow-red-200' : ''
          }`}
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {isSpeaking ? (
              <Square className="w-5 h-5 fill-current text-white" />
            ) : (
              <Play className="w-5 h-5 fill-current text-white ml-0.5" />
            )}
          </div>
          <span className="font-black text-xl tracking-wider uppercase">
            {isSpeaking ? 'إيقاف الصوت (Stop)' : 'تشغيل الصوت (Play)'}
          </span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !scriptText.trim()}
          className="w-full sm:w-auto px-8 py-5 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-gray-300 rounded-3xl shadow-lg shadow-green-200 flex items-center justify-center space-x-3 rtl:space-x-reverse transition-all transform hover:scale-[1.02] active:scale-95 text-white font-bold"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-wide">
            {isDownloading ? 'جاري التحميل...' : 'حفظ كملف صوتی (Download MP3)'}
          </span>
        </button>
      </div>

      {downloadStatus && (
        <div className="text-center p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-2xl text-xs font-bold animate-fade-in">
          {downloadStatus}
        </div>
      )}

    </div>
  );
};

