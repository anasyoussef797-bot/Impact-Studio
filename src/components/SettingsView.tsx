import React, { useState } from 'react';
import { Settings, Info, Radio, Volume2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [audioFocus, setAudioFocus] = useState(true);
  const [pitchBoost, setPitchBoost] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Studio Engine Settings (إعدادات محرك الصوت)
          </h2>
          <p className="text-xs text-slate-500">
            إعدادات التحكم المعالجة الصوتية والترددات وتركيز الخفيات.
          </p>
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
          Impact Studio is a professional text-to-speech studio engineered specifically to convert text into spoken audio using realistic children's voices powered by Gemini TTS.
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
            <span className="block text-[10px] text-purple-300">TTS Engine</span>
            <span className="font-bold text-xs text-white">Gemini TTS</span>
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
