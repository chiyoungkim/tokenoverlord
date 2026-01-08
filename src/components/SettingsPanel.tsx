import { X } from 'lucide-react';
import { useSettingsStore, type CardSize } from '../store/settingsStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { autoStackEnabled, minStackSize, cardSize, setAutoStackEnabled, setMinStackSize, setCardSize } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Card Size Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Card Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as CardSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setCardSize(size)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    cardSize === size
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-sm capitalize">{size}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {size === 'small' && '80px'}
                    {size === 'medium' && '100px'}
                    {size === 'large' && '120px'}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Smaller cards fit more tokens on screen
            </p>
          </div>

          {/* Auto-Stack Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Auto-Stack Tokens
              </label>
              <button
                onClick={() => setAutoStackEnabled(!autoStackEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoStackEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoStackEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Automatically group identical tokens together
            </p>
          </div>

          {/* Min Stack Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Tokens to Stack
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="10"
                value={minStackSize}
                onChange={(e) => setMinStackSize(parseInt(e.target.value))}
                disabled={!autoStackEnabled}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: autoStackEnabled
                    ? `linear-gradient(to right, #2563eb 0%, #2563eb ${((minStackSize - 2) / 8) * 100}%, #e5e7eb ${((minStackSize - 2) / 8) * 100}%, #e5e7eb 100%)`
                    : '#e5e7eb'
                }}
              />
              <span className="text-lg font-bold text-gray-700 w-8 text-center">
                {minStackSize}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {autoStackEnabled
                ? `Stack when you have ${minStackSize}+ identical tokens`
                : 'Enable auto-stack to adjust this setting'}
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              How Auto-Stacking Works
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Tokens group when ALL properties match</li>
              <li>• Name, P/T, colors, abilities, tap state, counters</li>
              <li>• Click count badge or card to open stack</li>
              <li>• Use ⟲/↻ buttons to tap/untap entire stack</li>
              <li>• Stacks split automatically when states differ</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};