import { useState } from 'react';
import type { Color, TokenTemplate } from '../types/token';
import { useTokenStore } from '../store/tokenStore';
import { ModalWrapper } from './ModalWrapper';

interface CustomTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomTokenModal: React.FC<CustomTokenModalProps> = ({ isOpen, onClose }) => {
  const { addToken, saveTemplate } = useTokenStore();
  
  const [name, setName] = useState('');
  const [power, setPower] = useState<string>('');
  const [toughness, setToughness] = useState<string>('');
  const [colors, setColors] = useState<Color[]>([]);
  const [abilities, setAbilities] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saveAsPreset, setSaveAsPreset] = useState(false);
  const [hasHaste, setHasHaste] = useState(false);

  const handleColorToggle = (color: Color) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a token name');
      return;
    }

    const template: TokenTemplate = {
      name: name.trim(),
      power: power ? parseInt(power) : null,
      toughness: toughness ? parseInt(toughness) : null,
      colors,
      abilities: abilities.trim() || undefined,
      hasHaste: hasHaste,
    };

    // Save as preset if checkbox is checked
    if (saveAsPreset) {
      saveTemplate(template);
    }

    addToken(template, quantity);
    
    // Reset form
    setName('');
    setPower('');
    setToughness('');
    setColors([]);
    setAbilities('');
    setQuantity(1);
    setSaveAsPreset(false);
    setHasHaste(false);
    onClose();
  };

  const colorButtons: { color: Color; label: string; bgClass: string; hoverClass: string }[] = [
    { color: 'W', label: 'White', bgClass: 'bg-gray-100', hoverClass: 'hover:bg-gray-200' },
    { color: 'U', label: 'Blue', bgClass: 'bg-blue-500', hoverClass: 'hover:bg-blue-600' },
    { color: 'B', label: 'Black', bgClass: 'bg-gray-800', hoverClass: 'hover:bg-gray-900' },
    { color: 'R', label: 'Red', bgClass: 'bg-red-500', hoverClass: 'hover:bg-red-600' },
    { color: 'G', label: 'Green', bgClass: 'bg-green-500', hoverClass: 'hover:bg-green-600' },
    { color: 'C', label: 'Colorless', bgClass: 'bg-gray-400', hoverClass: 'hover:bg-gray-500' },
  ];

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Token"
      maxWidth="2xl"
    >
      <div className="p-6 space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Token Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Zombie, Dragon, Treasure"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 font-medium"
            autoFocus
          />
        </div>

        {/* Power/Toughness */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Power
            </label>
            <input
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="X"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 font-medium text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Toughness
            </label>
            <input
              type="number"
              value={toughness}
              onChange={(e) => setToughness(e.target.value)}
              placeholder="X"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 font-medium text-center"
            />
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Colors
          </label>
          <div className="grid grid-cols-3 gap-3">
            {colorButtons.map(({ color, label, bgClass, hoverClass }) => (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`px-4 py-3 ${bgClass} ${hoverClass} rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                  colors.includes(color)
                    ? 'ring-4 ring-indigo-400 ring-offset-2 shadow-lg'
                    : 'opacity-60 hover:opacity-100'
                } ${color === 'W' ? 'text-gray-800' : 'text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Abilities */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Abilities (Optional)
          </label>
          <textarea
            value={abilities}
            onChange={(e) => setAbilities(e.target.value)}
            placeholder="e.g., Flying, Vigilance, Trample"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 resize-none"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="999"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 font-medium text-center"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasHaste}
              onChange={(e) => setHasHaste(e.target.checked)}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-all"
            />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
              Has Haste (no summoning sickness)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={saveAsPreset}
              onChange={(e) => setSaveAsPreset(e.target.checked)}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-all"
            />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
              Save as preset
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Create Token{quantity > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};