import React, { useState } from 'react';
import { Play, Square, Users, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { ChildCharacter, LanguageDialectId } from '../types';
import { LANGUAGE_DIALECTS, speechEngine } from '../utils/speechSynthesis';

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
  };

  const selectedCharacters = characters.filter((c) => c.isSelected);

  const handlePlay = () => {
    if (isSpeaking) {
      speechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    const charsToSpeak = selectedCharacters.length > 0 ? selectedCharacters : [characters[0]];

    speechEngine.speakGroupChorus(
      scriptText,
      charsToSpeak,
      selectedDialect,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Script Input Box */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#E1F5FE] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="px-3 py-1 bg-[#E0F7FA] text-[#00838F] rounded-xl text-xs font-extrabold uppercase tracking-wide">
              Editor
            </span>
            <span className="text-gray-400 text-xs font-semibold">
              | {selectedCharacters.length > 0 ? `${selectedCharacters.map(c => c.name).join(', ')}` : 'Default Voice'}
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
              <span>Reset</span>
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
              Clear
            </button>
          </div>
          <p className="font-semibold text-[#7B1FA2]">
            {scriptText.length} Characters | {currentDialectObj.nativeName}
          </p>
        </div>
      </div>

      {/* Voice Characters Roster */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#F1F8E9] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-[#81C784]" />
            <span>Voice Characters (أصوات الأطفال)</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Group Chorus</span>
            <span className="px-2.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-extrabold border border-green-200">
              {selectedCharacters.length} / 5 Selected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {characters.map((char) => {
            const isSelected = char.isSelected;
            return (
              <div
                key={char.id}
                onClick={() => toggleCharacterSelection(char.id)}
                className={`flex flex-col items-center p-3.5 rounded-2xl cursor-pointer transition-all border-2 text-center ${
                  isSelected
                    ? 'bg-[#E1F5FE] border-[#4FC3F7] shadow-sm transform scale-102'
                    : 'bg-white hover:bg-gray-50 border-gray-100 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="text-3xl mb-1">{char.avatar}</div>
                <span className={`text-xs font-extrabold ${isSelected ? 'text-[#0288D1]' : 'text-gray-700'}`}>
                  {char.arabicName}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">{char.name}</span>
                {isSelected && (
                  <div className="w-1.5 h-1.5 bg-[#0288D1] rounded-full mt-1 animate-pulse" />
                )}
              </div>
            );
          })}
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
              {isSpeaking ? `Voices: ${selectedCharacters.map(c => c.name).join(', ') || characters[0].name}` : 'Click Play Speech below'}
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

      {/* Play Speech CTA Button */}
      <div className="flex justify-center pt-2">
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
            {isSpeaking ? 'Stop Speech' : 'Play Speech'}
          </span>
        </button>
      </div>

    </div>
  );
};
