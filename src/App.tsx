import { useState } from 'react';
import { Settings, Hash, Bug, Layers } from 'lucide-react';
import { QuickCreateBar } from './components/QuickCreateBar';
import { TokenGrid } from './components/TokenGrid';
import { ActionBar } from './components/ActionBar';
import { CustomTokenModal } from './components/CustomTokenModal';
import { Graveyard } from './components/Graveyard';
import { SettingsPanel } from './components/SettingsPanel';
import { CounterTypesManager } from './components/CounterTypesManager';
import { ScryfallDebugPanel } from './components/ScryfallDebugPanel';
import { TokenTemplateManager } from './components/TokenTemplateManager';
import { useTokenStore } from './store/tokenStore';
import { useScryfallData } from './hooks/useScryfallData';

function App() {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCounterTypesOpen, setIsCounterTypesOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(true); // Show by default for now
  const { tokens, graveyard, clearGraveyard, restoreFromGraveyard } = useTokenStore();
  
  // Fetch Scryfall data for common tokens on mount
  const { isLoading: scryfallLoading, isReady: scryfallReady } = useScryfallData();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Modern gradient with better shadows */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-xl">
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Token Tracker</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-indigo-100 font-medium">
                {tokens.length} token{tokens.length !== 1 ? 's' : ''} on battlefield
              </p>
              {scryfallLoading && (
                <span className="text-xs text-amber-300 font-medium">🔮 Loading card art...</span>
              )}
              {scryfallReady && (
                <span className="text-xs text-emerald-300 font-medium">✓ Card art ready</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsTemplateManagerOpen(true)}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              title="Manage Templates"
            >
              <Layers size={24} />
            </button>
            <button 
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={`p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${showDebugPanel ? 'bg-white/20' : ''}`}
              title="Toggle Scryfall Debug"
            >
              <Bug size={24} />
            </button>
            <button 
              onClick={() => setIsCounterTypesOpen(true)}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              title="Manage Counter Types"
            >
              <Hash size={24} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              title="Settings"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Create Bar - Modern card-style with subtle shadow */}
      <div className="sticky top-[80px] z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-lg">
        <QuickCreateBar onCustomCreate={() => setIsCustomModalOpen(true)} />
      </div>

      {/* Token Grid */}
      <main className="flex-1 overflow-y-auto">
        <TokenGrid />
      </main>

      {/* Action Bar */}
      <ActionBar />

      {/* Graveyard */}
      <Graveyard
        tokens={graveyard}
        onClear={clearGraveyard}
        onRestore={restoreFromGraveyard}
      />

      {/* Custom Token Modal */}
      <CustomTokenModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Counter Types Manager */}
      <CounterTypesManager
        isOpen={isCounterTypesOpen}
        onClose={() => setIsCounterTypesOpen(false)}
      />
      
      {/* Token Template Manager */}
      <TokenTemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
      />
      
      {/* Scryfall Debug Panel */}
      {showDebugPanel && <ScryfallDebugPanel />}
    </div>
  );
}

export default App;