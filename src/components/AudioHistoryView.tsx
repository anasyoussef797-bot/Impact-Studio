import React from 'react';
import { Play, Download, Trash2, Music, Clock } from 'lucide-react';
import { AudioHistoryItem } from '../types';

interface AudioHistoryViewProps {
  history: AudioHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const AudioHistoryView: React.FC<AudioHistoryViewProps> = ({
  history,
  onClearHistory,
  onDeleteItem
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-indigo-100 space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-indigo-950 text-sm">
              سجل المقاطع الصوتية المنشأة (Audio Generation Library)
            </h3>
            <p className="text-[11px] text-gray-500">
              استمع وأعد تحميل جميع التسجيلات الصوتية التي قمت بتوليدها خلال هذه الجلسة.
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>مسح السجل</span>
        </button>
      </div>

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl border border-indigo-100/60 gap-3 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-indigo-100">
                {item.characterAvatar}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-indigo-950">{item.characterName}</span>
                  <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-700 font-medium line-clamp-1 mt-0.5" dir="auto">
                  "{item.textSnippet}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <audio controls src={item.audioBlobUrl} className="h-8 max-w-[180px] sm:max-w-[220px]" />

              <a
                href={item.audioBlobUrl}
                download={`arabic_tts_${item.characterName}_${Date.now()}.wav`}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                title="تحميل المقطع"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
