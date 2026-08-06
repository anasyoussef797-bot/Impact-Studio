import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MainStudioView } from './components/MainStudioView';
import { CharactersView } from './components/CharactersView';
import { SettingsView } from './components/SettingsView';
import { AndroidCodeExporter } from './components/AndroidCodeExporter';
import { SplashOverlay } from './components/SplashOverlay';
import { INITIAL_CHARACTERS } from './utils/speechSynthesis';
import { ChildCharacter } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'characters' | 'settings' | 'android-code'>('studio');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [characters, setCharacters] = useState<ChildCharacter[]>(INITIAL_CHARACTERS);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased selection:bg-purple-500 selection:text-white">
      
      {/* 2-Second Initial Splash Overlay */}
      {showSplash && <SplashOverlay onComplete={() => setShowSplash(false)} />}

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* View Router */}
      <main className="flex-1 py-6 px-2 sm:px-4">
        {activeTab === 'studio' && (
          <MainStudioView characters={characters} setCharacters={setCharacters} />
        )}
        {activeTab === 'characters' && (
          <CharactersView characters={characters} setCharacters={setCharacters} />
        )}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'android-code' && <AndroidCodeExporter />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Impact Studio • Native Android App developed by <strong className="text-amber-400">Impact Hub Egypt</strong>
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            Package: com.impacthubegypt.impactstudio
          </span>
        </div>
      </footer>

    </div>
  );
}
