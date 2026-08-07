import React, { useState } from 'react';
import { Sparkles, Play, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Database, Volume2, Info, FileCode } from 'lucide-react';

export interface VoiceTestResult {
  voiceName: string;
  lang: 'ar' | 'en';
  text: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  httpStatus?: number;
  engineHeader?: string;
  modelHeader?: string;
  voiceHeader?: string;
  requestedVoiceHeader?: string;
  byteLength?: number;
  audioHash?: string;
  audioUrl?: string;
  errorMessage?: string;
  timestamp?: string;
}

const TEST_VOICES = [
  'Aoede', 'Puck', 'Callisto', 'Pegasus',
  'Zephyr', 'Leda', 'Fenrir', 'Kore',
  'Charon', 'Orpheus', 'Miranda', 'Umbriel'
];

const ARABIC_TEST_TEXT = "مرحباً. هذا اختبار لهوية الصوت.";
const ENGLISH_TEST_TEXT = "Hello. This is a voice identity test.";

function computeAudioHash(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hash1 = 0x811c9dc5;
  let hash2 = 0x53c5d172;
  const len = bytes.length;
  
  if (len === 0) return 'EMPTY_BUFFER';

  const step = Math.max(1, Math.floor(len / 1000));
  for (let i = 0; i < len; i += step) {
    hash1 ^= bytes[i];
    hash1 = Math.imul(hash1, 0x01000193);
    hash2 ^= bytes[i];
    hash2 = Math.imul(hash2, 0x050c5d17);
  }
  
  const h1Hex = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2Hex = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `LEN:${len}_H:${h1Hex}-${h2Hex}`;
}

export const GeminiVoiceDiagnosticSuite: React.FC = () => {
  const [results, setResults] = useState<Record<string, VoiceTestResult>>({});
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [activePlaybackKey, setActivePlaybackKey] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const keyFor = (voice: string, lang: 'ar' | 'en') => `${voice}_${lang}`;

  const runSingleTest = async (voice: string, lang: 'ar' | 'en'): Promise<VoiceTestResult> => {
    const text = lang === 'ar' ? ARABIC_TEST_TEXT : ENGLISH_TEST_TEXT;
    const key = keyFor(voice, lang);

    setResults(prev => ({
      ...prev,
      [key]: {
        voiceName: voice,
        lang,
        text,
        status: 'loading',
        timestamp: new Date().toLocaleTimeString()
      }
    }));

    try {
      // Direct, fresh request to server-side /api/tts endpoint without caching
      const timestamp = Date.now();
      const url = `/api/tts?q=${encodeURIComponent(text)}&tl=${lang}&voice=${encodeURIComponent(voice)}&_t=${timestamp}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      const httpStatus = response.status;
      const engineHeader = response.headers.get('X-TTS-Engine') || 'Unknown';
      const modelHeader = response.headers.get('X-TTS-Model') || 'Unknown';
      const voiceHeader = response.headers.get('X-TTS-Voice') || 'Unknown';
      const requestedVoiceHeader = response.headers.get('X-TTS-Requested-Voice') || voice;

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: 'HTTP Error ' + response.status }));
        const resObj: VoiceTestResult = {
          voiceName: voice,
          lang,
          text,
          status: 'error',
          httpStatus,
          engineHeader,
          modelHeader,
          voiceHeader,
          requestedVoiceHeader,
          errorMessage: errJson.error || errJson.hint || 'Server request failed',
          timestamp: new Date().toLocaleTimeString()
        };
        setResults(prev => ({ ...prev, [key]: resObj }));
        return resObj;
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioHash = computeAudioHash(arrayBuffer);
      const blob = new Blob([arrayBuffer], { type: response.headers.get('Content-Type') || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      const resObj: VoiceTestResult = {
        voiceName: voice,
        lang,
        text,
        status: 'success',
        httpStatus,
        engineHeader,
        modelHeader,
        voiceHeader,
        requestedVoiceHeader,
        byteLength: arrayBuffer.byteLength,
        audioHash,
        audioUrl,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => ({ ...prev, [key]: resObj }));
      return resObj;
    } catch (err: any) {
      const resObj: VoiceTestResult = {
        voiceName: voice,
        lang,
        text,
        status: 'error',
        errorMessage: err.message || 'Network failure',
        timestamp: new Date().toLocaleTimeString()
      };
      setResults(prev => ({ ...prev, [key]: resObj }));
      return resObj;
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (const voice of TEST_VOICES) {
      await runSingleTest(voice, 'ar');
      await runSingleTest(voice, 'en');
    }
    setIsRunningAll(false);
  };

  const playResultAudio = (key: string, url?: string) => {
    if (!url) return;
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }

    if (activePlaybackKey === key) {
      setActivePlaybackKey(null);
      return;
    }

    const audio = new Audio(url);
    audio.onended = () => setActivePlaybackKey(null);
    audio.onerror = () => setActivePlaybackKey(null);
    audio.play();
    setAudioElement(audio);
    setActivePlaybackKey(key);
  };

  // Analyze hash uniqueness & diagnosis
  const arHashes = TEST_VOICES.map(v => results[keyFor(v, 'ar')]?.audioHash).filter(Boolean);
  const enHashes = TEST_VOICES.map(v => results[keyFor(v, 'en')]?.audioHash).filter(Boolean);
  const uniqueArHashes = new Set(arHashes).size;
  const uniqueEnHashes = new Set(enHashes).size;

  const enginesUsed = Array.from(new Set(
    Object.values(results).map((r: VoiceTestResult) => r.engineHeader).filter(Boolean)
  ));

  return (
    <div className="bg-slate-950 p-5 rounded-3xl border border-indigo-500/30 space-y-5 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white tracking-wide">
              GEMINI TTS VOICE DIAGNOSTIC (اختبار فحص الأصوات الفعلي)
            </h3>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-full">
              Direct API Suite
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            اختبار مباشر لكل هوية صوتية بشكل مستقل دون تخزين مؤقت أو تعديل في نبرة الصوت (Direct Gemini Request with Hash Verification).
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunningAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 border border-indigo-400/40 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningAll ? 'animate-spin' : ''}`} />
          <span>{isRunningAll ? 'جاري فحص جميع الأصوات...' : 'تشغيل الاختبار الشامل (Run All 12 Voices)'}</span>
        </button>
      </div>

      {/* Diagnostics Quick Metric Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">المحركات النشطة (Engine Used)</span>
          <div className="font-mono text-emerald-400 font-extrabold truncate">
            {enginesUsed.length > 0 ? enginesUsed.join(', ') : 'في انتظار التشغيل'}
          </div>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">تنوع البصمات (AR Unique Hashes)</span>
          <div className="font-mono text-indigo-300 font-extrabold">
            {uniqueArHashes} / {arHashes.length} مختبرة
          </div>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">تنوع البصمات (EN Unique Hashes)</span>
          <div className="font-mono text-sky-300 font-extrabold">
            {uniqueEnHashes} / {enHashes.length} مختبرة
          </div>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">حالة البصمات (Hash Integrity)</span>
          <div className={`font-bold truncate text-[11px] ${
            uniqueArHashes > 1 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {uniqueArHashes > 1 ? 'أصوات مختلفة (Distinct Audio)' : 'نفس البصمة الصوتيّة (Check Cache)'}
          </div>
        </div>
      </div>

      {/* Test Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-xs text-right">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-bold text-[11px]">
            <tr>
              <th className="p-3 text-right">اسم الصوت (Voice ID)</th>
              <th className="p-3 text-center">اختبار العربي (Arabic)</th>
              <th className="p-3 text-center">اختبار الإنجليزي (English)</th>
              <th className="p-3 text-center">بصمة الصوت العربي (AR Hash)</th>
              <th className="p-3 text-center">بصمة الصوت الإنجليزي (EN Hash)</th>
              <th className="p-3 text-center">الصوت المرسل لـ Gemini</th>
              <th className="p-3 text-center">المحرك (Engine)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {TEST_VOICES.map(voice => {
              const arRes = results[keyFor(voice, 'ar')];
              const enRes = results[keyFor(voice, 'en')];
              const isPlayingAr = activePlaybackKey === keyFor(voice, 'ar');
              const isPlayingEn = activePlaybackKey === keyFor(voice, 'en');

              return (
                <tr key={voice} className="hover:bg-slate-800/40 transition-colors">
                  {/* Voice Name */}
                  <td className="p-3 font-extrabold text-indigo-300 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>{voice}</span>
                    </div>
                  </td>

                  {/* Arabic Test Button */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => runSingleTest(voice, 'ar')}
                      disabled={arRes?.status === 'loading'}
                      className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 rounded-lg text-[10px] font-sans font-bold flex items-center justify-center gap-1 mx-auto disabled:opacity-50 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-indigo-400" />
                      <span>{arRes?.status === 'loading' ? 'جاري...' : 'اختبار AR'}</span>
                    </button>
                    {arRes?.audioUrl && (
                      <button
                        onClick={() => playResultAudio(keyFor(voice, 'ar'), arRes.audioUrl)}
                        className={`mt-1 text-[9px] px-2 py-0.5 rounded flex items-center gap-1 mx-auto font-sans font-bold cursor-pointer ${
                          isPlayingAr ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>{isPlayingAr ? 'جاري التشغيل' : 'استماع AR'}</span>
                      </button>
                    )}
                  </td>

                  {/* English Test Button */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => runSingleTest(voice, 'en')}
                      disabled={enRes?.status === 'loading'}
                      className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 rounded-lg text-[10px] font-sans font-bold flex items-center justify-center gap-1 mx-auto disabled:opacity-50 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-purple-400" />
                      <span>{enRes?.status === 'loading' ? 'Testing...' : 'Test EN'}</span>
                    </button>
                    {enRes?.audioUrl && (
                      <button
                        onClick={() => playResultAudio(keyFor(voice, 'en'), enRes.audioUrl)}
                        className={`mt-1 text-[9px] px-2 py-0.5 rounded flex items-center gap-1 mx-auto font-sans font-bold cursor-pointer ${
                          isPlayingEn ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>{isPlayingEn ? 'Playing' : 'Listen EN'}</span>
                      </button>
                    )}
                  </td>

                  {/* AR Hash */}
                  <td className="p-3 text-center text-[10px] text-slate-300">
                    {arRes?.audioHash ? (
                      <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-indigo-300">
                        {arRes.audioHash}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* EN Hash */}
                  <td className="p-3 text-center text-[10px] text-slate-300">
                    {enRes?.audioHash ? (
                      <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-sky-300">
                        {enRes.audioHash}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* Sent Voice */}
                  <td className="p-3 text-center text-[10px] text-amber-300">
                    {arRes?.voiceHeader || enRes?.voiceHeader || voice}
                  </td>

                  {/* Engine */}
                  <td className="p-3 text-center text-[10px]">
                    {arRes?.engineHeader === 'Gemini-TTS' ? (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold font-sans">
                        Gemini-TTS ({arRes.modelHeader})
                      </span>
                    ) : arRes?.engineHeader ? (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-bold font-sans">
                        {arRes.engineHeader}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Technical Summary Banner */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>ملخص نتيجة التشخيص الفني (Technical Diagnostic Summary):</span>
        </div>
        <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
          <li>
            <strong>النموذج المستخدم:</strong> Gemini 2.0 Flash (<code className="text-indigo-300">gemini-2.0-flash</code>) عبر مسار الخادم <code className="text-indigo-300">/api/tts</code>.
          </li>
          <li>
            <strong>الأصوات الأساسية من Gemini:</strong> يدعم Gemini رسمياً 5 أصوات رئيسية (<code className="text-emerald-300">Aoede</code>، <code className="text-emerald-300">Puck</code>، <code className="text-emerald-300">Kore</code>، <code className="text-emerald-300">Fenrir</code>، <code className="text-emerald-300">Charon</code>).
          </li>
          <li>
            <strong>الطلب المباشر:</strong> يتم إرسال البارامتر <code className="text-indigo-300">voiceName</code> مباشرةً ضمن <code className="text-indigo-300">prebuiltVoiceConfig</code> لتعديل الهوية الصوتية في كل طلب مستمر.
          </li>
        </ul>
      </div>
    </div>
  );
};
