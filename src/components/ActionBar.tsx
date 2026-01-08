import { Hand, HandMetal, Sun, Trash2, Skull, PlusCircle, MinusCircle } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-lg">
      <div className="flex justify-around p-3 max-w-2xl mx-auto">
        <button
          onClick={tapAll}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <Hand size={24} className="text-gray-700" />
          <span className="text-xs font-medium text-gray-700">Tap All</span>
        </button>

        <button
          onClick={untapAll}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <HandMetal size={24} className="text-gray-700" />
          <span className="text-xs font-medium text-gray-700">Untap All</span>
        </button>

        <button
          onClick={handleAddCounterToAll}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <PlusCircle size={24} className="text-green-600" />
          <span className="text-xs font-medium text-green-600">+1/+1 All</span>
        </button>

        <button
          onClick={handleRemoveCounterToAll}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <MinusCircle size={24} className="text-red-600" />
          <span className="text-xs font-medium text-red-600">-1/-1 All</span>
        </button>

        <button
          onClick={clearSummoningSickness}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <Sun size={24} className="text-yellow-600" />
          <span className="text-xs font-medium text-gray-700">New Turn</span>
        </button>

        <button
          onClick={handleCleanup}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <Skull size={24} className="text-orange-600" />
          <span className="text-xs font-medium text-orange-600">Cleanup</span>
        </button>

        <button
          onClick={handleClearAll}
          className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
          disabled={tokens.length === 0}
        >
          <Trash2 size={24} className="text-red-600" />
          <span className="text-xs font-medium text-red-600">Clear</span>
        </button>
      </div>
    </div>
  );
};