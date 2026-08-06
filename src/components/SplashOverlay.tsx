import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashOverlayProps {
  onComplete: () => void;
}

export const SplashOverlay: React.FC<SplashOverlayProps> = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 1800);
    const timer2 = setTimeout(() => onComplete(), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFBF0] text-[#2D3748] transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center p-8 max-w-md animate-bounce">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#FFD54F] flex items-center justify-center text-5xl shadow-md border-2 border-amber-300">
          🎙️
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#4527A0]">Impact Studio</h1>
        <p className="text-[#7B1FA2] text-sm font-bold mb-6 uppercase tracking-wider">
          Children's Voice Text-To-Speech Studio
        </p>

        <div className="inline-flex items-center gap-2 bg-[#F3E5F5] px-4 py-2 rounded-full border border-purple-200 text-xs font-extrabold text-[#7B1FA2]">
          <Sparkles className="w-4 h-4 text-[#FF7043]" />
          <span>Developed by Impact Hub Egypt</span>
        </div>
      </div>
    </div>
  );
};
