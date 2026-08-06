import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileCode, Folder, Shield, Layers, FileText } from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { downloadAndroidProjectZip } from '../utils/zipExporter';

export const AndroidCodeExporter: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(11); // default to TTSManager.kt
  const [copied, setCopied] = useState<boolean>(false);

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gradle':
        return <Layers className="w-4 h-4 text-emerald-500" />;
      case 'manifest':
        return <Shield className="w-4 h-4 text-rose-500" />;
      case 'kotlin':
        return <FileCode className="w-4 h-4 text-purple-500" />;
      case 'res':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <Folder className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 text-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-[#E1F5FE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#F3E5F5] text-[#7B1FA2] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
              Kotlin & Jetpack Compose
            </span>
            <span className="text-xs text-gray-500 font-bold">
              Target SDK 34 • Min SDK 24
            </span>
          </div>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight text-[#4527A0]">
            Impact Studio - Native Android Project Source Code
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Package: <code className="text-[#0288D1] font-mono font-bold">com.impacthubegypt.impactstudio</code> • Developer: <strong className="text-gray-800">Impact Hub Egypt</strong>
          </p>
        </div>

        <button
          onClick={downloadAndroidProjectZip}
          className="flex items-center gap-2 bg-[#81C784] hover:bg-[#66BB6A] text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-sm transition-all border border-green-300 active:scale-95"
        >
          <Download className="w-5 h-5" />
          <span>Download Complete Project ZIP</span>
        </button>
      </div>

      {/* Code Explorer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-[#FFF9C4] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 px-1">
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#7B1FA2]" />
              <span>Project File Tree ({ANDROID_PROJECT_FILES.length} Files)</span>
            </h3>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs font-medium ${
                    isSelected
                      ? 'bg-[#E1F5FE] text-[#0288D1] font-extrabold border border-[#4FC3F7] shadow-xs'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {getCategoryIcon(file.category)}
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono px-1.5 py-0.5 bg-gray-100 rounded-md">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-[#1A237E] rounded-3xl border-2 border-indigo-900 shadow-xl overflow-hidden flex flex-col">
          
          {/* Header Bar */}
          <div className="bg-[#0D47A1] px-5 py-3.5 flex items-center justify-between border-b border-indigo-800">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentFile.category)}
              <span className="font-mono text-xs font-bold text-[#FFD54F]">
                {currentFile.path}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 bg-[#FF7043] hover:bg-[#F4511E] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy File Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text Area */}
          <div className="p-5 overflow-x-auto max-h-[580px] font-mono text-xs text-indigo-100 leading-relaxed whitespace-pre">
            {currentFile.code}
          </div>

        </div>

      </div>

    </div>
  );
};
