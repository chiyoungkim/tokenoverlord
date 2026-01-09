import { useSettingsStore, type CardSize } from '../store/settingsStore';
import { ModalWrapper } from './ModalWrapper';
import { Maximize, Layers } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { autoStackEnabled, minStackSize, cardSize, setAutoStackEnabled, setMinStackSize, setCardSize } = useSettingsStore();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      maxWidth="lg"
    >
      <div className="p-6 space-y-8">
        {/* Card Size Selector */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Maximize className="text-indigo-600" size={20} />
            <label className="text-base font-bold text-gray-800">
              Card Size
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(['small', 'medium', 'large'] as CardSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setCardSize(size)}
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  cardSize === size
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg ring-4 ring-indigo-200 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
              >
                <div className="text-sm capitalize font-bold">{size}</div>
                <div className="text-xs opacity-80 mt-1 font-medium">
                  {size === 'small' && '80px'}
                  {size === 'medium' && '100px'}
                  {size === 'large' && '120px'}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            Smaller cards fit more tokens on screen
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Auto-Stack Toggle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="text-emerald-600" size={20} />
              <label className="text-base font-bold text-gray-800">
                Auto-Stack Tokens
              </label>
            </div>
            <button
              onClick={() => setAutoStackEnabled(!autoStackEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 ${
                autoStackEnabled ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  autoStackEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Automatically group identical tokens together
          </p>
        </div>

        {/* Min Stack Size Slider */}
        <div className={`transition-opacity duration-200 ${!autoStackEnabled ? 'opacity-50' : ''}`}>
          <label className="block text-base font-bold text-gray-800 mb-4">
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
              className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: autoStackEnabled
                  ? `linear-gradient(to right, #10b981 0%, #10b981 ${((minStackSize - 2) / 8) * 100}%, #e5e7eb ${((minStackSize - 2) / 8) * 100}%, #e5e7eb 100%)`
                  : '#e5e7eb'
              }}
            />
            <span className="text-2xl font-bold text-indigo-600 w-12 text-center bg-indigo-50 rounded-xl px-3 py-2">
              {minStackSize}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            {autoStackEnabled
              ? `Stack when you have ${minStackSize}+ identical tokens`
              : 'Enable auto-stack to adjust this setting'}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Info Box */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5">
          <h3 className="text-base font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <Layers size={18} />
            How Auto-Stacking Works
          </h3>
          <ul className="text-sm text-indigo-800 space-y-2 font-medium">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Tokens group when ALL properties match</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Name, P/T, colors, abilities, tap state, counters</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Click count badge or card to open stack</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Use ⟲/↻ buttons to tap/untap entire stack</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Stacks split automatically when states differ</span>
            </li>
          </ul>
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