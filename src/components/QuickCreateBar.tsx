import { Plus, X, Zap } from 'lucide-react';
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
      <div className="flex gap-3 p-4 min-w-max items-center">
        {/* Quantity Input - Modern Design */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
          <Zap size={16} className="text-amber-400" />
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">Quantity:</label>
          <input
            type="number"
            min="1"
            max="999"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-1.5 text-sm font-semibold bg-slate-900 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
        
        {/* Common Tokens - Primary Actions */}
        {COMMON_TOKENS.map((template) => (
          <button
            key={template.name}
            onClick={() => addToken(template, quantity)}
            className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            {template.name}
          </button>
        ))}
        
        {/* Custom Templates - Success Style */}
        {customTemplates.map((template) => (
          <div key={template.name} className="relative group flex-shrink-0">
            <button
              onClick={() => addToken(template, quantity)}
              className="px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
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
              className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95"
              title="Remove preset"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Custom Create Button - Special Styling */}
        <button
          onClick={onCustomCreate}
          className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Custom Token
        </button>
      </div>
    </div>
  );
};