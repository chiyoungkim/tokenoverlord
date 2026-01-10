import { useState } from 'react';
import { X } from 'lucide-react';
import { useTokenStore } from '../store/tokenStore';
import { parseManaSymbols } from '../utils/manaSymbols';

interface CustomTokenEditorProps {
  tokenName: string;
  onClose: () => void;
  onOpenArtPicker: () => void;
}

const COLOR_OPTIONS = [
  { value: 'W', label: 'White', color: 'bg-amber-50 text-gray-900' },
  { value: 'U', label: 'Blue', color: 'bg-blue-500' },
  { value: 'B', label: 'Black', color: 'bg-gray-900' },
  { value: 'R', label: 'Red', color: 'bg-red-600' },
  { value: 'G', label: 'Green', color: 'bg-green-600' },
  { value: 'C', label: 'Colorless', color: 'bg-gray-400' },
];

export const CustomTokenEditor: React.FC<CustomTokenEditorProps> = ({ 
  tokenName, 
  onClose,
  onOpenArtPicker,
}) => {
  const { customTemplates, updateCustomTemplate } = useTokenStore();
  const template = customTemplates.find(t => t.name === tokenName);

  const [name, setName] = useState(template?.name || '');
  const [power, setPower] = useState(template?.power?.toString() || '');
  const [toughness, setToughness] = useState(template?.toughness?.toString() || '');
  const [colors, setColors] = useState<string[]>(template?.colors || []);
  const [abilities, setAbilities] = useState(template?.abilities || '');
  const [hasHaste, setHasHaste] = useState(template?.hasHaste || false);

  if (!template) return null;

  const handleSave = () => {
    const isCreature = power !== '' && toughness !== '';
    
    updateCustomTemplate(tokenName, {
      name,
      power: isCreature ? parseInt(power) : null,
      toughness: isCreature ? parseInt(toughness) : null,
      colors: colors as ('W'|'U'|'B'|'R'|'G'|'C')[],
      abilities: abilities || undefined,
      hasHaste,
    });
    
    onClose();
  };

  const toggleColor = (color: string) => {
    setColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Edit Token</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Token name"
            />
          </div>

          {/* P/T */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Power (leave empty for non-creature)
              </label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="*"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Toughness (leave empty for non-creature)
              </label>
              <input
                type="number"
                value={toughness}
                onChange={(e) => setToughness(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="*"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => toggleColor(value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    colors.includes(value)
                      ? `${color} ring-2 ring-white`
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Abilities (use {'{}'} for mana symbols)
            </label>
            <textarea
              value={abilities}
              onChange={(e) => setAbilities(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Flying, haste"
            />
            {abilities && (
              <div className="mt-2 p-2 bg-slate-800 rounded text-sm text-white">
                Preview: {parseManaSymbols(abilities)}
              </div>
            )}
          </div>

          {/* Haste */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasHaste"
              checked={hasHaste}
              onChange={(e) => setHasHaste(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="hasHaste" className="text-sm font-medium text-slate-300">
              Has Haste (no summoning sickness)
            </label>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Artwork</label>
            <button
              onClick={onOpenArtPicker}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
            >
              Change Artwork
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};