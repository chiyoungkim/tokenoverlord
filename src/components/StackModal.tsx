import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import type { Token } from '../types/token';
import { TokenCard } from './TokenCard';
import { useCounterTypesStore } from '../store/counterTypesStore';

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
  onRemoveSummoningSickness: (id: string) => void;
  onAddCustomCounter: (id: string, type: string, icon?: string) => void;
  onRemoveCustomCounter: (id: string, type: string) => void;
  onSetCounterAmount: (id: string, type: string, amount: number) => void;
  onUpdateCounterIcon: (id: string, type: string, icon: string) => void;
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
  onRemoveSummoningSickness,
  onAddCustomCounter,
  onRemoveCustomCounter,
  onSetCounterAmount,
  onUpdateCounterIcon,
}) => {
  const [splitCount, setSplitCount] = useState('');
  const [counterCount, setCounterCount] = useState('');
  const [counterAmount, setCounterAmount] = useState('');
  const [showIndividual, setShowIndividual] = useState(false);
  const [selectedBatchCounter, setSelectedBatchCounter] = useState('');
  const [newCounterType, setNewCounterType] = useState('');
  const [newCounterIcon, setNewCounterIcon] = useState('📍');
  const { customCounterTypes, addCounterType } = useCounterTypesStore();

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

          {/* Batch Custom Counters */}
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-300">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Batch Counter Operations</h4>
            <div className="flex gap-2 items-center mb-2">
              <select
                value={selectedBatchCounter}
                onChange={(e) => setSelectedBatchCounter(e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Select counter type...</option>
                <option value="+1/+1">⬆ +1/+1</option>
                <option value="-1/-1">⬇ -1/-1</option>
                <option value="loyalty">⚡ loyalty</option>
                <option value="charge">🔋 charge</option>
                <option value="energy">Ⓔ energy</option>
                <option value="poison">☠ poison</option>
                <option value="treasure">💰 treasure</option>
                <option value="food">🍖 food</option>
                {customCounterTypes.map(ct => (
                  <option key={ct.type} value={ct.type}>{ct.icon} {ct.type}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (selectedBatchCounter) {
                    tokens.forEach(t => {
                      if (selectedBatchCounter === '+1/+1') {
                        onAddCounter(t.id);
                      } else if (selectedBatchCounter === '-1/-1') {
                        onRemoveCounter(t.id);
                      } else {
                        onAddCustomCounter(t.id, selectedBatchCounter);
                      }
                    });
                  }
                }}
                disabled={!selectedBatchCounter}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add to All
              </button>
              <button
                onClick={() => {
                  if (selectedBatchCounter) {
                    tokens.forEach(t => {
                      onRemoveCustomCounter(t.id, selectedBatchCounter);
                    });
                  }
                }}
                disabled={!selectedBatchCounter}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Remove from All
              </button>
            </div>
            
            {/* Create New Counter Type */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Create New Counter Type:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCounterIcon}
                  onChange={(e) => setNewCounterIcon(e.target.value)}
                  placeholder="📍"
                  maxLength={2}
                  className="w-12 px-2 py-1 text-center text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={newCounterType}
                  onChange={(e) => setNewCounterType(e.target.value)}
                  placeholder="e.g., 'stun', 'shield'"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (newCounterType.trim()) {
                      addCounterType(newCounterType.trim(), newCounterIcon, 'gray');
                      setSelectedBatchCounter(newCounterType.trim());
                      setNewCounterType('');
                      setNewCounterIcon('📍');
                    }
                  }}
                  disabled={!newCounterType.trim()}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Counter to X tokens */}
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min="1"
              max={tokens.length}
              value={counterCount}
              onChange={(e) => setCounterCount(e.target.value)}
              placeholder="# tokens..."
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={() => {
                const count = parseInt(counterCount);
                if (count > 0 && count <= tokens.length) {
                  tokens.slice(0, count).forEach(t => onAddCounter(t.id));
                  setCounterCount('');
                }
              }}
              disabled={!counterCount}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            >
              +1/+1 to First X
            </button>
          </div>

          {/* Add/Remove X counters to all */}
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder="+3 or -2..."
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={() => {
                const amount = parseInt(counterAmount);
                if (amount > 0) {
                  tokens.forEach(t => {
                    for (let i = 0; i < amount; i++) {
                      onAddCounter(t.id);
                    }
                  });
                } else if (amount < 0) {
                  tokens.forEach(t => {
                    for (let i = 0; i < Math.abs(amount); i++) {
                      onRemoveCounter(t.id);
                    }
                  });
                }
                setCounterAmount('');
              }}
              disabled={!counterAmount}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            >
              Add/Remove X to All
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
                  onRemoveSummoningSickness={() => onRemoveSummoningSickness(token.id)}
                  onAddCustomCounter={(type, icon) => onAddCustomCounter(token.id, type, icon)}
                  onRemoveCustomCounter={(type) => onRemoveCustomCounter(token.id, type)}
                  onSetCounterAmount={(type, amt) => onSetCounterAmount(token.id, type, amt)}
                  onUpdateCounterIcon={(type, icon) => onUpdateCounterIcon(token.id, type, icon)}
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