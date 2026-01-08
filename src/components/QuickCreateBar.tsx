import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { COMMON_TOKENS } from '../types/token';
import { useTokenStore } from '../store/tokenStore';

interface QuickCreateBarProps {
  onCustomCreate: () => void;
}

export const QuickCreateBar: React.FC<QuickCreateBarProps> = ({ onCustomCreate }) => {
  const { addToken, customTemplates, removeTemplate } = useTokenStore();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 p-3 min-w-max items-center">
        {/* Quantity Input */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Qty:</label>
          <input
            type="number"
            min="1"
            max="999"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {COMMON_TOKENS.map((template) => (
          <button
            key={template.name}
            onClick={() => addToken(template, quantity)}
            className="flex-shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow transition-colors whitespace-nowrap"
          >
            {template.name}
          </button>
        ))}
        
        {/* Custom Templates */}
        {customTemplates.map((template) => (
          <div key={template.name} className="relative group flex-shrink-0">
            <button
              onClick={() => addToken(template, quantity)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow transition-colors whitespace-nowrap"
            >
              {template.name}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Remove "${template.name}" preset?`)) {
                  removeTemplate(template.name);
                }
              }}
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove preset"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        <button
          onClick={onCustomCreate}
          className="flex-shrink-0 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow transition-colors flex items-center gap-1"
        >
          <Plus size={18} />
          Custom
        </button>
      </div>
    </div>
  );
};