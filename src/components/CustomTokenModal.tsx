import { useState } from 'react';
import { X } from 'lucide-react';
import type { Color, TokenTemplate } from '../types/token';
import { useTokenStore } from '../store/tokenStore';

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
    onClose();
  };

  if (!isOpen) return null;

  const colorButtons: { color: Color; label: string; bg: string }[] = [
    { color: 'W', label: 'White', bg: 'bg-yellow-100' },
    { color: 'U', label: 'Blue', bg: 'bg-blue-500' },
    { color: 'B', label: 'Black', bg: 'bg-gray-900' },
    { color: 'R', label: 'Red', bg: 'bg-red-600' },
    { color: 'G', label: 'Green', bg: 'bg-green-600' },
    { color: 'C', label: 'Colorless', bg: 'bg-gray-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Create Custom Token</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Token Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Angel, Treasure, Dragon"
            />
          </div>

          {/* Power/Toughness */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Power</label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Leave empty for non-creatures"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Toughness</label>
              <input
                type="number"
                value={toughness}
                onChange={(e) => setToughness(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Leave empty for non-creatures"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {colorButtons.map(({ color, label, bg }) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    colors.includes(color)
                      ? `${bg} text-white ring-2 ring-offset-2 ring-blue-500`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${color === 'B' && colors.includes(color) ? 'text-white' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <label className="block text-sm font-medium mb-1">Abilities (Optional)</label>
            <textarea
              value={abilities}
              onChange={(e) => setAbilities(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="e.g., Flying, Haste"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save as Preset */}
        <div className="px-4 pb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsPreset}
              onChange={(e) => setSaveAsPreset(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Save as preset for quick creation later</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};