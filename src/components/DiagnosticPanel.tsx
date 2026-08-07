import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Volume2, Info } from 'lucide-react';
import { speechEngine, TTSDiagnosticInfo } from '../utils/speechSynthesis';

export const DiagnosticPanel: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<TTSDiagnosticInfo | null>(speechEngine.getLatestDiagnostic());
  const [runningTest, setRunningTest] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = speechEngine.subscribeDiagnostic((info) => {
      setDiagnostic(info);
    });
    return unsubscribe;
  }, []);

  const handleRunTest = (testId: 1 | 2 | 3 | 4 | 5) => {
    speechEngine.runDiagnosticTest(
      testId,
      (desc) => setRunningTest(desc),
      () => setRunningTest(null)
    );
  };

  const handleTestArabicVoice = () => {
    setRunningTest('اختبار الصوت العربي (Arabic Test Voice)...');
    speechEngine.testArabicVoice(undefined, () => {
      setRunningTest(null);
    });
  };

  const handleABTest = (voiceName: string, lang: 'ar' | 'en') => {
    const text = lang === 'ar' ? 'مرحباً، هذا اختبار للصوت.' : 'Hello, this is a voice test.';
    setRunningTest(`A/B Test: ${voiceName} (${lang.toUpperCase()})...`);
    speechEngine.testVoiceAB(voiceName, text, lang, () => {
      setRunningTest(null);
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border-2 border-purple-500/30 shadow-xl space-y-5">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                لوحة فحص وتشخيص الصوت (TTS Developer Diagnostics)
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                Gemini API Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              مراقبة فورية لمحرك النطق، لغة الإدخال، حالة الخادم، وتنسيق الصوت المسترجع.
            </p>
          </div>
        </div>

        {/* Quick Test Arabic Voice Button */}
        <button
          onClick={handleTestArabicVoice}
          disabled={runningTest !== null}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-900/30 border border-emerald-400/30 disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4 text-emerald-200" />
          <span>اختبار الصوت العربي (Test Arabic Voice)</span>
        </button>
      </div>

      {/* Realtime Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        {/* Language */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">اللغة المكتشفة (Language)</span>
          <div className="font-extrabold text-purple-300 truncate">
            {diagnostic ? (diagnostic.isArabic ? 'ar (عربي - Gemini)' : diagnostic.inputLanguage) : 'لم يتم التشغيل بعد'}
          </div>
        </div>

        {/* Engine */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">محرك الصوت (Engine)</span>
          <div className="font-extrabold text-emerald-400 truncate">
            {diagnostic?.engineHeader || diagnostic?.engine || 'Gemini Server TTS'}
          </div>
        </div>

        {/* Model */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">النموذج (Model)</span>
          <div className="font-extrabold text-amber-300 font-mono text-[11px] truncate">
            {diagnostic?.modelHeader || 'gemini-2.5-flash'}
          </div>
        </div>

        {/* Voice Name */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">اسم الصوت (Voice)</span>
          <div className="font-extrabold text-sky-300 truncate">
            {diagnostic?.voiceUsed || 'Zephyr / Kore'}
          </div>
        </div>

        {/* Audio Format */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">تنسيق الصوت (Audio Format)</span>
          <div className="font-extrabold text-pink-300 font-mono text-[11px] truncate">
            {diagnostic?.audioFormat || '24000Hz PCM WAV'}
          </div>
        </div>

        {/* Status */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">الحالة (Status)</span>
          <div className="flex items-center gap-1.5 font-extrabold">
            {diagnostic?.status === 'error' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">خطأ ({diagnostic.httpStatus || 'Fail'})</span>
              </>
            ) : diagnostic?.status === 'playing' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-300">جاري التشغيل</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">جاهز (200 OK)</span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Error Message Alert (If any) */}
      {diagnostic?.errorMessage && (
        <div className="bg-rose-950/80 border border-rose-500/50 p-3 rounded-2xl text-xs text-rose-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-rose-300">تفاصيل الخطأ التشخيصي:</span>
            <p className="font-mono text-[11px]">{diagnostic.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Automated Diagnostic Suite (Tests 1 - 5) */}
      <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span className="flex items-center gap-1.5 text-purple-400">
            <Terminal className="w-4 h-4" />
            <span>مجموعة الاختبارات الآلية التشخيصية (Automated Diagnostic Suite):</span>
          </span>
          {runningTest && (
            <span className="text-amber-400 font-mono animate-pulse text-[11px]">
              {runningTest}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          
          {/* Test 1 */}
          <button
            onClick={() => handleRunTest(1)}
            disabled={runningTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/80 transition-all text-xs space-y-1 hover:border-purple-500/50"
          >
            <div className="flex items-center justify-between text-sky-400 font-bold text-[11px]">
              <span>Test 1: English</span>
              <Play className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">Hello, welcome to AI Studio...</p>
          </button>

          {/* Test 2 */}
          <button
            onClick={() => handleRunTest(2)}
            disabled={runningTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-right border border-slate-700/80 transition-all text-xs space-y-1 hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px] rtl:flex-row-reverse">
              <span>اختبار 2: عربي (Gemini)</span>
              <Play className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate" dir="rtl">مرحباً بكم في عالم التعلم...</p>
          </button>

          {/* Test 3 */}
          <button
            onClick={() => handleRunTest(3)}
            disabled={runningTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/80 transition-all text-xs space-y-1 hover:border-amber-500/50"
          >
            <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
              <span>Test 3: French</span>
              <Play className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">Bonjour et bienvenue...</p>
          </button>

          {/* Test 4 */}
          <button
            onClick={() => handleRunTest(4)}
            disabled={runningTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/80 transition-all text-xs space-y-1 hover:border-indigo-500/50"
          >
            <div className="flex items-center justify-between text-indigo-400 font-bold text-[11px]">
              <span>Test 4: German</span>
              <Play className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">Hallo und willkommen...</p>
          </button>

          {/* Test 5 */}
          <button
            onClick={() => handleRunTest(5)}
            disabled={runningTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-right border border-slate-700/80 transition-all text-xs space-y-1 hover:border-pink-500/50"
          >
            <div className="flex items-center justify-between text-pink-400 font-bold text-[11px] rtl:flex-row-reverse">
              <span>اختبار 5: عربي + إنجليزي</span>
              <Play className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate" dir="rtl">مرحباً بكم - Hello World!</p>
          </button>

        </div>
      </div>

      {/* A/B Direct Voice Identity Test Suite (Direct Gemini Voice Verification) */}
      <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>اختبار الأصوات المباشر (Direct Gemini Voice A/B Verification):</span>
          </span>
          <span className="text-[10px] text-slate-400">
            اختبار مباشر ونفس النص للتأكد من اختلاف الهويات الصوتية
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {/* Aoede Arabic */}
          <button
            onClick={() => handleABTest('Aoede', 'ar')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-right border border-indigo-500/40 text-xs flex flex-col justify-between hover:border-indigo-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-indigo-300">Aoede (عربي)</span>
              <Play className="w-3 h-3 text-indigo-400" />
            </div>
            <span className="text-[9px] text-indigo-200/80 mt-1 truncate font-mono">مرحباً، هذا اختبار...</span>
          </button>

          {/* Fenrir Arabic */}
          <button
            onClick={() => handleABTest('Fenrir', 'ar')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-right border border-purple-500/40 text-xs flex flex-col justify-between hover:border-purple-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-purple-300">Fenrir (عربي)</span>
              <Play className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-[9px] text-purple-200/80 mt-1 truncate font-mono">مرحباً، هذا اختبار...</span>
          </button>

          {/* Leda Arabic */}
          <button
            onClick={() => handleABTest('Leda', 'ar')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-pink-950/80 hover:bg-pink-900 text-right border border-pink-500/40 text-xs flex flex-col justify-between hover:border-pink-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-pink-300">Leda (عربي)</span>
              <Play className="w-3 h-3 text-pink-400" />
            </div>
            <span className="text-[9px] text-pink-200/80 mt-1 truncate font-mono">مرحباً، هذا اختبار...</span>
          </button>

          {/* Aoede English */}
          <button
            onClick={() => handleABTest('Aoede', 'en')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-600/60 text-xs flex flex-col justify-between hover:border-sky-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-sky-300">Aoede (EN)</span>
              <Play className="w-3 h-3 text-sky-400" />
            </div>
            <span className="text-[9px] text-slate-300 mt-1 truncate font-mono">Hello, this is...</span>
          </button>

          {/* Fenrir English */}
          <button
            onClick={() => handleABTest('Fenrir', 'en')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-600/60 text-xs flex flex-col justify-between hover:border-emerald-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-emerald-300">Fenrir (EN)</span>
              <Play className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-[9px] text-slate-300 mt-1 truncate font-mono">Hello, this is...</span>
          </button>

          {/* Leda English */}
          <button
            onClick={() => handleABTest('Leda', 'en')}
            disabled={runningTest !== null}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-600/60 text-xs flex flex-col justify-between hover:border-amber-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold text-amber-300">Leda (EN)</span>
              <Play className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-[9px] text-slate-300 mt-1 truncate font-mono">Hello, this is...</span>
          </button>
        </div>
      </div>

      {/* Architecture Spec Info Banner */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
        <span className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Architecture: Frontend → Vercel/Express Server /api/tts → Gemini API (GEMINI_API_KEY) → PCM WAV Header → Audio</span>
        </span>
        <span className="font-mono text-[10px] text-slate-500">Route: /api/tts</span>
      </div>

    </div>
  );
};
