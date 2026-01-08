import { Skull } from 'lucide-react';
import type { Token } from '../types/token';

interface GraveyardProps {
  tokens: Token[];
  onClear: () => void;
  onRestore: (token: Token) => void;
}

export const Graveyard: React.FC<GraveyardProps> = ({ tokens, onClear, onRestore }) => {
  if (tokens.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-gray-800 border-t-4 border-purple-600 shadow-lg z-30 max-w-2xl mx-auto">
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Skull size={20} className="text-purple-400" />
            <span className="text-white font-semibold">
              Graveyard: {tokens.length} died this turn
            </span>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Token List - Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tokens.map((token) => (
            <button
              key={token.id}
              onClick={() => onRestore(token)}
              className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs transition-colors"
              title="Click to restore"
            >
              <div className="font-semibold">{token.name}</div>
              {token.power !== null && (
                <div className="text-gray-400">{token.power}/{token.toughness}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
