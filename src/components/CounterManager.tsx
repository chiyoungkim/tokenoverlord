import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Token } from '../types/token';
import { COUNTER_TYPES } from '../types/token';
import { useCounterTypesStore } from '../store/counterTypesStore';

interface CounterManagerProps {
  token: Token;
  isOpen: boolean;
  onClose: () => void;
  onAddCounter: (counterType: string, icon?: string) => void;
  onRemoveCounter: (counterType: string) => void;
  onSetAmount: (counterType: string, amount: number) => void;
  onUpdateIcon: (counterType: string, icon: string) => void;
}

export const CounterManager: React.FC<CounterManagerProps> = ({
  token,
  isOpen,
  onClose,
  onAddCounter,
  onRemoveCounter,
  onSetAmount,
  onUpdateIcon,
}) => {
  const [customType, setCustomType] = useState('');
  const [customIcon, setCustomIcon] = useState('📍');
  const [editingIcon, setEditingIcon] = useState<string | null>(null);
  const { customCounterTypes, addCounterType } = useCounterTypesStore();

  if (!isOpen) return null;

  const getCounterColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
      blue: 'bg-blue-600',
      yellow: 'bg-yellow-500',
      amber: 'bg-amber-500',
    };
    return colors[color] || 'bg-gray-600';
  };

  const getCounter = (type: string) => {
    return token.counters?.find(c => c.type === type);
  };

  const getCounterIcon = (type: string) => {
    // First check if token has this counter with custom icon
    const tokenCounter = token.counters?.find(c => c.type === type);
    if (tokenCounter?.icon) return tokenCounter.icon;
    
    // Fall back to default from COUNTER_TYPES
    const defaultType = COUNTER_TYPES.find(ct => ct.type === type);
    return defaultType?.icon || '📍';
  };

  const allCounterTypes = [
    ...COUNTER_TYPES,
    ...customCounterTypes,
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Counters - {token.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Counter Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {allCounterTypes.map((ct) => {
              const counter = getCounter(ct.type);
              const count = counter?.count || 0;

              return (
                <div
                  key={ct.type}
                  className={`${getCounterColor(ct.color)} text-white rounded-lg p-3 flex flex-col gap-2`}
                >
                  <div className="flex items-center justify-between">
                    {editingIcon === ct.type ? (
                      <input
                        type="text"
                        value={getCounterIcon(ct.type)}
                        onChange={(e) => {
                          onUpdateIcon(ct.type, e.target.value);
                        }}
                        onBlur={() => setEditingIcon(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingIcon(null);
                        }}
                        autoFocus
                        className="text-2xl w-12 bg-white bg-opacity-20 rounded px-1 text-center"
                        maxLength={2}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingIcon(ct.type)}
                        className="text-2xl hover:bg-white hover:bg-opacity-20 rounded px-1 transition-colors"
                        title="Click to edit icon"
                      >
                        {getCounterIcon(ct.type)}
                      </button>
                    )}
                    <span className="text-sm font-medium">{ct.type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveCounter(ct.type)}
                      disabled={count === 0}
                      className="flex-1 bg-black bg-opacity-20 hover:bg-opacity-30 disabled:opacity-30 disabled:cursor-not-allowed rounded px-2 py-1 text-sm font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onSetAmount(ct.type, val);
                      }}
                      className="w-12 text-center bg-white text-gray-800 rounded px-1 py-1 text-sm font-bold"
                    />
                    <button
                      onClick={() => onAddCounter(ct.type)}
                      className="flex-1 bg-black bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Counter Type */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom Counter Type
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                placeholder="📍"
                maxLength={2}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                title="Icon/Emoji"
              />
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="e.g., 'time', 'verse'"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (customType.trim()) {
                    // Add to global counter types store
                    addCounterType(customType.trim(), customIcon, 'gray');
                    // Add counter to this token
                    onAddCounter(customType.trim(), customIcon);
                    setCustomType('');
                    setCustomIcon('📍');
                  }
                }}
                disabled={!customType.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};