import React, { useState, useEffect } from 'react';
import { Search, Volume2, Check, Sparkles, AlertCircle, RefreshCw, Filter, Music } from 'lucide-react';
import { ElevenLabsVoiceInfo } from '../types';
import { speechEngine } from '../utils/speechSynthesis';

interface ElevenLabsVoicePickerProps {
  selectedVoiceId?: string;
  onSelectVoice: (voice: ElevenLabsVoiceInfo) => void;
  onClose?: () => void;
}

export const ElevenLabsVoicePicker: React.FC<ElevenLabsVoicePickerProps> = ({
  selectedVoiceId,
  onSelectVoice,
  onClose,
}) => {
  const [voices, setVoices] = useState<ElevenLabsVoiceInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Preview Audio state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const loadVoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await speechEngine.fetchElevenLabsVoices();
      setVoices(fetched);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل أصوات ElevenLabs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoices();
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, []);

  const handlePlayPreview = (voice: ElevenLabsVoiceInfo) => {
    if (audioObj) {
      audioObj.pause();
    }

    if (playingVoiceId === voice.voice_id) {
      setPlayingVoiceId(null);
      return;
    }

    if (voice.preview_url) {
      const audio = new Audio(voice.preview_url);
      setAudioObj(audio);
      setPlayingVoiceId(voice.voice_id);
      audio.play().catch((e) => console.warn('Preview play failed:', e));
      audio.onended = () => setPlayingVoiceId(null);
    } else {
      // Fallback: request sample audio from server
      setPlayingVoiceId(voice.voice_id);
      const url = `/api/tts?q=${encodeURIComponent('مرحباً بكم، هذا تجربة لصوت إيلفن لابز')}&voice=${encodeURIComponent(voice.voice_id)}&provider=elevenlabs`;
      const audio = new Audio(url);
      setAudioObj(audio);
      audio.play().catch((e) => {
        console.warn('Sample play failed:', e);
        setPlayingVoiceId(null);
      });
      audio.onended = () => setPlayingVoiceId(null);
      audio.onerror = () => setPlayingVoiceId(null);
    }
  };

  const filteredVoices = voices.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.description || '').toLowerCase().includes(search.toLowerCase()) ||
      v.voice_id.toLowerCase().includes(search.toLowerCase()) ||
      (v.labels?.accent || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.labels?.use_case || '').toLowerCase().includes(search.toLowerCase());

    const gender = (v.labels?.gender || '').toLowerCase();
    const matchesGender =
      genderFilter === 'all' ||
      (genderFilter === 'female' && (gender.includes('female') || gender.includes('woman'))) ||
      (genderFilter === 'male' && (gender.includes('male') || gender.includes('man')));

    const category = (v.category || '').toLowerCase();
    const matchesCategory =
      categoryFilter === 'all' || category.includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesGender && matchesCategory;
  });

  const categories = Array.from(new Set(voices.map((v) => v.category).filter(Boolean))) as string[];

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-lg space-y-4 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#7B1FA2] flex items-center justify-center font-bold text-lg">
            🎙️
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-2">
              <span>مكتبة أصوات ElevenLabs AI</span>
              <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">
                ElevenLabs API
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              اختر صوتاً احترافياً فائق الواقعية بدعم متعدد اللغات والعربية
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن اسم الصوت، اللهجة، أو الوصف..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-9 text-xs font-bold text-gray-800 outline-none focus:border-purple-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Gender filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                genderFilter === 'all' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              الكل ({voices.length})
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('female')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                genderFilter === 'female' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              👩 إناث
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('male')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                genderFilter === 'male' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              👨 ذكور
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadVoices}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] transition-all border border-purple-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث الأصوات</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600">جاري الاتصال بـ ElevenLabs وجلب قائمة الأصوات...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>خطأ في جلب أصوات ElevenLabs</span>
          </div>
          <p>{error}</p>
          <p className="text-[11px] text-gray-600">
            تأكد من إعداد متغير البيئة ELEVENLABS_API_KEY على السيرفر.
          </p>
        </div>
      )}

      {/* Voice List Grid */}
      {!loading && !error && (
        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 text-xs">
          {filteredVoices.length === 0 ? (
            <div className="py-8 text-center text-gray-500 font-bold">
              لا توجد أصوات تطابق البحث الحالي
            </div>
          ) : (
            filteredVoices.map((voice) => {
              const isSelected = selectedVoiceId === voice.voice_id;
              const isPlaying = playingVoiceId === voice.voice_id;

              return (
                <div
                  key={voice.voice_id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-50/80 border-purple-400 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/20'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-gray-800 text-sm">{voice.name}</span>
                      {voice.labels?.gender && (
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize">
                          {voice.labels.gender}
                        </span>
                      )}
                      {voice.labels?.accent && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                          {voice.labels.accent}
                        </span>
                      )}
                      {voice.labels?.age && (
                        <span className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full">
                          {voice.labels.age}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-gray-400">
                        ID: {voice.voice_id.slice(0, 8)}...
                      </span>
                    </div>

                    {voice.description && (
                      <p className="text-[11px] text-gray-600 line-clamp-1">{voice.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayPreview(voice)}
                      className={`p-2 rounded-xl font-bold transition-all border ${
                        isPlaying
                          ? 'bg-amber-500 text-white border-amber-500 animate-pulse'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-100 hover:text-purple-800'
                      }`}
                      title="استماع لعينة الصوت"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Select Button */}
                    <button
                      type="button"
                      onClick={() => onSelectVoice(voice)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white border border-purple-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>الصوت المحدد</span>
                        </>
                      ) : (
                        <span>تحديد الصوت</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
