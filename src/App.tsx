import { useState } from 'react';
import { Settings } from 'lucide-react';
import { QuickCreateBar } from './components/QuickCreateBar';
import { TokenGrid } from './components/TokenGrid';
import { ActionBar } from './components/ActionBar';
import { CustomTokenModal } from './components/CustomTokenModal';
import { Graveyard } from './components/Graveyard';
import { SettingsPanel } from './components/SettingsPanel';
import { useTokenStore } from './store/tokenStore';

function App() {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { tokens, graveyard, clearGraveyard, restoreFromGraveyard } = useTokenStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed at top */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-bold">Token Tracker</h1>
            <p className="text-sm text-blue-100">
              {tokens.length} token{tokens.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Quick Create Bar - Also sticky below header */}
      <div className="sticky top-[72px] z-40 bg-white shadow-md">
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
    </div>
  );
}

export default App;