import React from 'react';
import { Plus, Trash2, Play, Volume2, User, Sparkles } from 'lucide-react';
import { ChildCharacter, DialogueLine, LanguageDialectId } from '../types';
import { speechEngine } from '../utils/speechSynthesis';

interface DialogueEditorProps {
  characters: ChildCharacter[];
  dialogueLines: DialogueLine[];
  setDialogueLines: React.Dispatch<React.SetStateAction<DialogueLine[]>>;
  selectedDialect: LanguageDialectId;
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
  activeLineIndex: number | null;
  setActiveLineIndex: (val: number | null) => void;
}

export const DialogueEditor: React.FC<DialogueEditorProps> = ({
  characters,
  dialogueLines,
  setDialogueLines,
  selectedDialect,
  isSpeaking,
  setIsSpeaking,
  activeLineIndex,
  setActiveLineIndex,
}) => {
  const addLine = () => {
    const defaultChar = characters[0];
    const newLine: DialogueLine = {
      id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      characterId: defaultChar.id,
      text: '',
      mood: 'happy'
    };
    setDialogueLines([...dialogueLines, newLine]);
  };

  const updateLineText = (id: string, text: string) => {
    setDialogueLines(prev => prev.map(l => l.id === id ? { ...l, text } : l));
  };

  const updateLineCharacter = (id: string, characterId: string) => {
    setDialogueLines(prev => prev.map(l => l.id === id ? { ...l, characterId } : l));
  };

  const removeLine = (id: string) => {
    if (dialogueLines.length <= 1) return;
    setDialogueLines(prev => prev.filter(l => l.id !== id));
  };

  const playSingleLine = (line: DialogueLine, index: number) => {
    if (!line.text.trim()) return;
    const char = characters.find(c => c.id === line.characterId) || characters[0];
    setActiveLineIndex(index);
    setIsSpeaking(true);

    speechEngine.speakGroupChorus(
      line.text,
      [char],
      selectedDialect,
      () => {},
      () => {
        setIsSpeaking(false);
        setActiveLineIndex(null);
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-purple-200 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <h3 className="font-extrabold text-[#4527A0] text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>محرر الحوار بين الشخصيات (Multi-Character Storyboard)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            صمم قصة حوارية كاملة بين الأطفال والمعلمين، وسيتم نطقه بالتتابع بصوت كل شخصية مخصصة!
          </p>
        </div>

        <button
          onClick={addLine}
          className="px-4 py-2 bg-[#7B1FA2] hover:bg-[#6A1B9A] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سطر حواري (Add Line)</span>
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {dialogueLines.map((line, idx) => {
          const char = characters.find(c => c.id === line.characterId) || characters[0];
          const isPlayingThis = isSpeaking && activeLineIndex === idx;

          return (
            <div
              key={line.id}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                isPlayingThis
                  ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : 'bg-gray-50/80 hover:bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-[160px]">
                <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>

                <div className="relative flex-1">
                  <select
                    value={line.characterId}
                    onChange={(e) => updateLineCharacter(line.id, e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-purple-400"
                  >
                    {characters.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.avatar} {c.arabicName} ({c.role === 'teacher' ? 'معلم' : 'طفل'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={line.text}
                onChange={(e) => updateLineText(line.id, e.target.value)}
                placeholder={`اكتب كلام ${char.arabicName} هنا...`}
                className="flex-1 w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-purple-500 transition-all"
                dir="auto"
              />

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => playSingleLine(line, idx)}
                  disabled={!line.text.trim() || isSpeaking}
                  className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
                  title="استماع للسطر فقط"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => removeLine(line.id)}
                  disabled={dialogueLines.length <= 1}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold disabled:opacity-30 transition-all cursor-pointer"
                  title="حذف السطر"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
