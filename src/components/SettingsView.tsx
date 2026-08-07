import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Heart, Info, Radio, Volume2, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { speechEngine } from '../utils/speechSynthesis';

export const SettingsView: React.FC = () => {
  const [audioFocus, setAudioFocus] = useState(true);
  const [pitchBoost, setPitchBoost] = useState(true);
  const [fallbackToGemini, setFallbackToGemini] = useState(false);
  const [elevenLabsStatus, setElevenLabsStatus] = useState<{ checked: boolean; ok: boolean; count?: number; message?: string }>({
    checked: false,
    ok: false,
  });

  useEffect(() => {
    speechEngine.setFallbackToGemini(fallbackToGemini);
  }, [fallbackToGemini]);

  const checkElevenLabs = async () => {
    try {
      const voices = await speechEngine.fetchElevenLabsVoices();
      setElevenLabsStatus({ checked: true, ok: true, count: voices.length });
    } catch (err: any) {
      setElevenLabsStatus({ checked: true, ok: false, message: err.message });
    }
  };

  useEffect(() => {
    checkElevenLabs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Studio Engine Settings (إعدادات محركات الصوت)
            </h2>
            <p className="text-xs text-slate-500">
              التحكم في مزودات الصوت (Gemini & ElevenLabs)، ووضع الاحتياط (Fallback)، وإعدادات معالجة الصوت.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-2xl border border-purple-100">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-extrabold text-purple-900">Multi-Provider TTS</span>
        </div>
      </div>

      {/* ElevenLabs Provider Settings & Status */}
      <div className="bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>إرجاع تلقائي لـ Gemini عند تعثر ElevenLabs (Fallback to Gemini)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              عند التفعيل، إذا حدث خطأ في مفتاح ElevenLabs أو نفذ الرصيد، سيعود النظام تلقائياً لصوت Gemini لتجنب انقطاع الصوت.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFallbackToGemini(!fallbackToGemini)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              fallbackToGemini ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                fallbackToGemini ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ElevenLabs API Key Status Indicator */}
        <div className="flex items-center justify-between bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-purple-900">حالة مفتاح ElevenLabs API Key على السيرفر:</span>
            {elevenLabsStatus.checked ? (
              elevenLabsStatus.ok ? (
                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>متصل بنجاح ({elevenLabsStatus.count} صوت متاح)</span>
                </span>
              ) : (
                <span className="font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  خطأ: {elevenLabsStatus.message}
                </span>
              )
            ) : (
              <span className="text-gray-500 font-bold">جاري الفحص...</span>
            )}
          </div>

          <button
            type="button"
            onClick={checkElevenLabs}
            className="p-1.5 rounded-xl hover:bg-purple-100 text-purple-700 font-bold"
            title="إعادة فحص الاتصال"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audio Engine Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-600" />
              <span>Audio Focus Ducking (تركيز الصوت)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              خفض الصوت الخلفي تلقائياً أثناء تحدث الشخصيات.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAudioFocus(!audioFocus)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              audioFocus ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                audioFocus ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-600" />
              <span>High Precision Child Pitch Synthesis</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              محاكاة الخصائص الصوتية للأطفال باستخدام خوارزميات خفض ورفع التردد (Float Pitch).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPitchBoost(!pitchBoost)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              pitchBoost ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                pitchBoost ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Developer & App Information */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg space-y-3 border border-purple-500/30">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Platform Specifications</span>
        </div>

        <h3 className="text-2xl font-black">Impact Studio Web Platform</h3>
        <p className="text-xs text-purple-200 leading-relaxed">
          Impact Studio is a professional multi-provider text-to-speech platform engineered to deliver lifelike character narrations and children's voices powered by Gemini TTS and ElevenLabs AI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
            <span className="block text-[10px] text-purple-300">Developer</span>
            <span className="font-bold text-xs text-amber-300">Impact Studio</span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
            <span className="block text-[10px] text-purple-300">Platform</span>
            <span className="font-bold text-xs text-white">Web Platform</span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
            <span className="block text-[10px] text-purple-300">TTS Engines</span>
            <span className="font-bold text-xs text-white">Gemini & ElevenLabs</span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
            <span className="block text-[10px] text-purple-300">Environment</span>
            <span className="font-bold text-xs text-emerald-400">Production Ready</span>
          </div>
        </div>
      </div>

    </div>
  );
};

