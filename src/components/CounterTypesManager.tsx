import { useState } from 'react';
import { Trash2, Edit2, Sparkles } from 'lucide-react';
import { useCounterTypesStore } from '../store/counterTypesStore';
import { COUNTER_TYPES } from '../types/token';
import { ModalWrapper } from './ModalWrapper';

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

  const getCounterColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-emerald-500 to-emerald-600',
      red: 'from-rose-500 to-rose-600',
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-amber-400 to-amber-500',
      amber: 'from-amber-500 to-amber-600',
      gray: 'from-gray-500 to-gray-600',
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Counter Types"
      maxWidth="3xl"
    >
      <div className="p-6 space-y-8">
        {/* Built-in Counter Types */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-600" size={20} />
            <h3 className="text-base font-bold text-gray-800">Built-in Counter Types</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COUNTER_TYPES.map((ct) => (
              <div
                key={ct.type}
                className={`bg-gradient-to-br ${getCounterColor(ct.color)} text-white rounded-xl p-4 flex items-center justify-between shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ct.icon}</span>
                  <span className="text-sm font-bold">{ct.type}</span>
                </div>
                <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-full font-semibold">Built-in</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Custom Counter Types */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit2 className="text-purple-600" size={20} />
              <h3 className="text-base font-bold text-gray-800">
                Custom Counter Types ({customCounterTypes.length})
              </h3>
            </div>
          </div>
          {customCounterTypes.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 font-medium">No custom counter types yet. Create one below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {customCounterTypes.map((ct) => (
                <div
                  key={ct.type}
                  className={`bg-gradient-to-br ${getCounterColor(ct.color)} text-white rounded-xl p-4 flex items-center justify-between shadow-lg group`}
                >
                  <div className="flex items-center gap-3">
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
                        className="text-3xl w-12 bg-white/20 rounded-lg px-1 text-center border-2 border-white/50"
                        maxLength={2}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingType(ct.type)}
                        className="text-3xl hover:bg-white/20 rounded-lg px-1 transition-all duration-200"
                        title="Click to edit icon"
                      >
                        {ct.icon}
                      </button>
                    )}
                    <span className="text-sm font-bold">{ct.type}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${ct.type}" counter type?`)) {
                        removeCounterType(ct.type);
                      }
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    title="Delete counter type"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Add New Counter Type */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
          <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            Create New Counter Type
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="📍"
              maxLength={2}
              className="w-20 px-4 py-3 border-2 border-purple-300 rounded-xl text-center text-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all bg-white"
              title="Icon/Emoji"
            />
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="e.g., 'stun', 'shield', 'time'"
              className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all font-medium bg-white"
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
              className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            >
              Create
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};