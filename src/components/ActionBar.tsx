import { Sun, Trash2, Skull, PlusCircle, MinusCircle } from 'lucide-react';
import { useTokenStore } from '../store/tokenStore';

export const ActionBar: React.FC = () => {
  const { tapAll, untapAll, clearSummoningSickness, clearAll, tokens, moveToGraveyard, addCounter, removeCounter } = useTokenStore();

  const handleClearAll = () => {
    if (tokens.length === 0) return;
    
    if (window.confirm(`Delete all ${tokens.length} tokens?`)) {
      clearAll();
    }
  };

  const handleCleanup = () => {
    // Find all tokens with toughness <= 0
    const dyingTokens = tokens.filter(token => {
      if (token.power === null || token.toughness === null) return false;
      const plusCounters = token.plusOneCounters ?? 0;
      const minusCounters = token.minusOneCounters ?? 0;
      const netCounters = plusCounters - minusCounters;
      const currentToughness = token.toughness + netCounters;
      return currentToughness <= 0;
    });

    if (dyingTokens.length === 0) {
      alert('No tokens need cleanup!');
      return;
    }

    if (window.confirm(`Destroy ${dyingTokens.length} dying token${dyingTokens.length > 1 ? 's' : ''}?`)) {
      dyingTokens.forEach(token => moveToGraveyard(token.id));
    }
  };

  const handleAddCounterToAll = () => {
    if (tokens.length === 0) return;
    tokens.forEach(token => addCounter(token.id));
  };

  const handleRemoveCounterToAll = () => {
    if (tokens.length === 0) return;
    tokens.forEach(token => removeCounter(token.id));
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none px-2">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl pointer-events-auto max-w-full">
        {/* Mobile: 2 rows, Desktop: 1 row */}
        <div className="flex flex-col sm:flex-row">
          {/* Row 1: Tap actions + Counter actions */}
          <div className="flex gap-1 p-2 border-b sm:border-b-0 sm:border-r border-slate-700">
            {/* Tap Actions Group */}
            <button
              onClick={tapAll}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-slate-800 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <i className="ms ms-tap ms-cost" style={{ fontSize: '24px', color: '#60a5fa' }} />
              <span className="text-[10px] font-semibold text-slate-300">Tap</span>
            </button>

            <button
              onClick={untapAll}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-slate-800 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <i className="ms ms-untap ms-cost" style={{ fontSize: '24px', color: '#60a5fa' }} />
              <span className="text-[10px] font-semibold text-slate-300">Untap</span>
            </button>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block w-px bg-slate-700 my-2" />

            {/* Counter Actions Group */}
            <button
              onClick={handleAddCounterToAll}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-emerald-950/50 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <PlusCircle size={24} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400">+1/+1</span>
            </button>

            <button
              onClick={handleRemoveCounterToAll}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-rose-950/50 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <MinusCircle size={24} className="text-rose-400" />
              <span className="text-[10px] font-semibold text-rose-400">-1/-1</span>
            </button>
          </div>

          {/* Row 2: Game state + Destructive actions */}
          <div className="flex gap-1 p-2">
            {/* Game State Actions */}
            <button
              onClick={clearSummoningSickness}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-amber-950/50 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <Sun size={24} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400">Turn</span>
            </button>

            <button
              onClick={handleCleanup}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-orange-950/50 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <Skull size={24} className="text-orange-400" />
              <span className="text-[10px] font-semibold text-orange-400">Clean</span>
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-700 my-2" />

            {/* Destructive Action */}
            <button
              onClick={handleClearAll}
              className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-rose-950/50 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={tokens.length === 0}
            >
              <Trash2 size={24} className="text-rose-500" />
              <span className="text-[10px] font-semibold text-rose-500">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};