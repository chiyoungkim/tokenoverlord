import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCounterTypesStore } from '../store/counterTypesStore';
import { COUNTER_TYPES } from '../types/token';

interface CounterTypesManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CounterTypesManager: React.FC<CounterTypesManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const { customCounterTypes, addCounterType, removeCounterType, updateCounterType } = useCounterTypesStore();
  const [newType, setNewType] = useState('');
  const [newIcon, setNewIcon] = useState('📍');
  const [editingType, setEditingType] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCounterColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
      blue: 'bg-blue-600',
      yellow: 'bg-yellow-500',
      amber: 'bg-amber-500',
      gray: 'bg-gray-600',
    };
    return colors[color] || 'bg-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Manage Counter Types</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Built-in Counter Types */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Built-in Counter Types</h3>
            <div className="grid grid-cols-2 gap-3">
              {COUNTER_TYPES.map((ct) => (
                <div
                  key={ct.type}
                  className={`${getCounterColor(ct.color)} text-white rounded-lg p-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ct.icon}</span>
                    <span className="text-sm font-medium">{ct.type}</span>
                  </div>
                  <span className="text-xs opacity-75">Built-in</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Counter Types */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Custom Counter Types ({customCounterTypes.length})
            </h3>
            {customCounterTypes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No custom counter types yet. Create one below!</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {customCounterTypes.map((ct) => (
                  <div
                    key={ct.type}
                    className={`${getCounterColor(ct.color)} text-white rounded-lg p-3 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      {editingType === ct.type ? (
                        <input
                          type="text"
                          value={ct.icon}
                          onChange={(e) => {
                            updateCounterType(ct.type, e.target.value, ct.color);
                          }}
                          onBlur={() => setEditingType(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingType(null);
                          }}
                          autoFocus
                          className="text-2xl w-12 bg-white bg-opacity-20 rounded px-1 text-center"
                          maxLength={2}
                        />
                      ) : (
                        <button
                          onClick={() => setEditingType(ct.type)}
                          className="text-2xl hover:bg-white hover:bg-opacity-20 rounded px-1 transition-colors"
                          title="Click to edit icon"
                        >
                          {ct.icon}
                        </button>
                      )}
                      <span className="text-sm font-medium">{ct.type}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${ct.type}" counter type?`)) {
                          removeCounterType(ct.type);
                        }
                      }}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      title="Delete counter type"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Counter Type */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Create New Counter Type</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="📍"
                maxLength={2}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center text-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                title="Icon/Emoji"
              />
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g., 'stun', 'shield', 'time'"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newType.trim()) {
                    addCounterType(newType.trim(), newIcon, 'gray');
                    setNewType('');
                    setNewIcon('📍');
                  }
                }}
                disabled={!newType.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Create
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