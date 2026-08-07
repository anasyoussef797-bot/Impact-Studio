import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'characters' | 'settings' | 'android-code';
  setActiveTab: (tab: 'studio' | 'characters' | 'settings' | 'android-code') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b-2 border-[#F0EAD6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Title & Developer Label */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-11 h-11 bg-[#FFD54F] rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-amber-300">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-2xl tracking-tight text-[#4527A0]">Impact Studio</h1>
              <span className="text-[10px] bg-[#E8EAF6] text-[#3F51B5] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide">
                منصة ويب مباشرة (Web Studio)
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-[#9E9E9E] font-bold">
              Impact Hub Egypt • Children TTS Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#FFFBF0] p-1.5 rounded-2xl border border-[#F0EAD6] text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'studio'
                ? 'bg-[#FF7043] text-white font-extrabold shadow-sm shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>الاستوديو (Studio)</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'characters'
                ? 'bg-[#7B1FA2] text-white font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>أدوات ضبط الأصوات (Voice Controls)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
