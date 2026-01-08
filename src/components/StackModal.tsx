import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import type { Token } from '../types/token';
import { TokenCard } from './TokenCard';

interface StackModalProps {
  tokens: Token[];
  isOpen: boolean;
  onClose: () => void;
  onTapHalf: () => void;
  onSplit: (count: number) => void;
  onAddCounterToAll: () => void;
  onRemoveCounterToAll: () => void;
  onToggleTap: (id: string) => void;
  onAddCounter: (id: string) => void;
  onRemoveCounter: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StackModal: React.FC<StackModalProps> = ({
  tokens,
  isOpen,
  onClose,
  onTapHalf,
  onSplit,
  onAddCounterToAll,
  onRemoveCounterToAll,
  onToggleTap,
  onAddCounter,
  onRemoveCounter,
  onDuplicate,
  onDelete,
}) => {
  const [splitCount, setSplitCount] = useState('');
  const [showIndividual, setShowIndividual] = useState(false);

  if (!isOpen) return null;

  const handleSplit = () => {
    const count = parseInt(splitCount);
    if (count > 0 && count < tokens.length) {
      onSplit(count);
      setSplitCount('');
    }
  };

  const representative = tokens[0];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold">{tokens.length}x {representative.name}</h2>
            <p className="text-sm text-blue-100">
              {representative.power !== null && `${representative.power}/${representative.toughness} • `}
              {representative.isTapped ? 'Tapped' : 'Untapped'}
              {representative.hasSummoningSickness && ' • Summoning Sick'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Zap size={16} />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={onTapHalf}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Tap Half ({Math.floor(tokens.length / 2)})
            </button>
            
            <button
              onClick={onAddCounterToAll}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              +1/+1 to All
            </button>
            
            <button
              onClick={onRemoveCounterToAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              -1/-1 to All
            </button>
            
            <button
              onClick={() => {
                if (window.confirm(`Delete all ${tokens.length} tokens?`)) {
                  tokens.forEach(t => onDelete(t.id));
                }
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Delete All
            </button>
          </div>

          {/* Split Custom */}
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={tokens.length - 1}
              value={splitCount}
              onChange={(e) => setSplitCount(e.target.value)}
              placeholder="Split count..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleSplit}
              disabled={!splitCount || parseInt(splitCount) <= 0 || parseInt(splitCount) >= tokens.length}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            >
              Split & Tap
            </button>
          </div>
        </div>

        {/* Individual View Toggle */}
        <div className="p-4 border-b bg-gray-50">
          <button
            onClick={() => setShowIndividual(!showIndividual)}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {showIndividual ? 'Hide Individual Tokens' : 'Show Individual Tokens'}
          </button>
        </div>

        {/* Individual Tokens Grid */}
        {showIndividual && (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onTap={() => onToggleTap(token.id)}
                  onAddCounter={() => onAddCounter(token.id)}
                  onRemoveCounter={() => onRemoveCounter(token.id)}
                  onDuplicate={() => onDuplicate(token.id)}
                  onDelete={() => {
                    if (window.confirm(`Move ${token.name} to graveyard?`)) {
                      onDelete(token.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};