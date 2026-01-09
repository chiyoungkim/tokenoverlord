import { getScryfallData } from '../hooks/useScryfallData';
import { COMMON_TOKENS } from '../types/token';

export const ScryfallDebugPanel: React.FC = () => {
  const tokens = COMMON_TOKENS.map(t => ({
    name: t.name,
    data: getScryfallData(t.name),
  }));

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-xl max-w-md max-h-96 overflow-y-auto z-50 text-xs">
      <h3 className="font-bold mb-2">🔮 Scryfall Debug</h3>
      {tokens.map(({ name, data }) => (
        <div key={name} className="mb-3 border-b border-slate-700 pb-2">
          <div className="font-semibold text-indigo-300">{name}</div>
          <div className="text-slate-400">
            Image: {data.imageUrl ? (
              <a href={data.imageUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                ✓ Available
              </a>
            ) : (
              <span className="text-rose-400">✗ None</span>
            )}
          </div>
          <div className="text-slate-400">
            Oracle: {data.oracleText ? (
              <span className="text-emerald-400">✓ {data.oracleText.substring(0, 30)}...</span>
            ) : (
              <span className="text-rose-400">✗ None</span>
            )}
          </div>
          {data.imageUrl && (
            <img src={data.imageUrl} alt={name} className="w-20 h-20 object-cover mt-1 rounded" />
          )}
        </div>
      ))}
    </div>
  );
};