import React, { useState } from 'react';
import { Sliders, Sparkles, UserCheck, RotateCcw } from 'lucide-react';
import { ChildCharacter } from '../types';
import { INITIAL_CHARACTERS } from '../utils/speechSynthesis';

interface CharactersViewProps {
  characters: ChildCharacter[];
  setCharacters: React.Dispatch<React.SetStateAction<ChildCharacter[]>>;
}

export const CharactersView: React.FC<CharactersViewProps> = ({ characters, setCharacters }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

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
              Children Voice Roster (إدارة أصوات الأطفال)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Fine-tune vocal pitch (frequency) and speech tempo for each virtual child character.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFFBF0] hover:bg-amber-100/60 text-[#7B1FA2] text-xs font-extrabold border border-amber-200 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((char) => {
          return (
            <div
              key={char.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#E1F5FE] shadow-sm space-y-4 transition-all hover:shadow-md"
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
                    <h3 className="font-extrabold text-[#2D3748] text-base">
                      {char.arabicName} ({char.name})
                    </h3>
                    <span className="text-[11px] font-extrabold text-[#7B1FA2]">
                      Child Voice Profile #{char.id.replace('char_', '')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    style={{ backgroundColor: char.color, color: '#fff' }}
                    className="text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs uppercase tracking-wide"
                  >
                    Pitch {char.pitch}x
                  </span>
                </div>
              </div>

              {/* Pitch Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-gray-700">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>Voice Pitch (نبرة الصوت)</span>
                  </span>
                  <span className="text-[#7B1FA2] font-black">{char.pitch}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={char.pitch}
                  onChange={(e) => handlePitchChange(char.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7B1FA2]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Child Default)</span>
                  <span>2.0x (High Pitch)</span>
                </div>
              </div>

              {/* Rate / Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-gray-700">
                  <span>Speech Rate (سرعة النطق)</span>
                  <span className="text-[#0288D1] font-black">{char.speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={char.speechRate}
                  onChange={(e) => handleRateChange(char.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0288D1]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>0.5x (Slow)</span>
                  <span>0.85x (Natural Child)</span>
                  <span>1.5x (Fast)</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
