import { Skull, RotateCcw } from 'lucide-react';
import type { Token } from '../types/token';

interface GraveyardProps {
  tokens: Token[];
  onClear: () => void;
  onRestore: (token: Token) => void;
}

export const Graveyard: React.FC<GraveyardProps> = ({ tokens, onClear, onRestore }) => {
  if (tokens.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900/95 backdrop-blur-md border-2 border-purple-500/50 shadow-2xl rounded-2xl z-30 animate-slide-in">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-xl">
              <Skull size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Graveyard</h3>
              <p className="text-purple-300 text-xs font-medium">{tokens.length} token{tokens.length !== 1 ? 's' : ''} destroyed</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-200"
          >
            Clear All
          </button>
        </div>

        {/* Token List - Horizontal scroll with better design */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800">
          {tokens.map((token) => (
            <button
              key={token.id}
              onClick={() => onRestore(token)}
              className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-purple-600 hover:to-purple-700 border-2 border-slate-600 hover:border-purple-400 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 group"
              title="Click to restore"
            >
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-bold text-sm">{token.name}</div>
              </div>
              {token.power !== null && (
                <div className="text-slate-300 text-xs font-semibold bg-slate-900/50 px-2 py-1 rounded-lg">
                  {token.power}/{token.toughness}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};