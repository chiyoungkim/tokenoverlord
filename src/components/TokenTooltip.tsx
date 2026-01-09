import type { Token } from '../types/token';
import { parseManaSymbols } from '../utils/manaSymbols';

interface TokenTooltipProps {
  token: Token;
  visible: boolean;
  position: { x: number; y: number; width?: number; height?: number };
}

export const TokenTooltip: React.FC<TokenTooltipProps> = ({ token, visible, position }) => {
  if (!visible) return null;

  const plusCounters = token.plusOneCounters ?? 0;
  const minusCounters = token.minusOneCounters ?? 0;
  const netCounters = plusCounters - minusCounters;
  const isCreature = token.power !== null && token.toughness !== null;
  const currentPower = (token.power ?? 0) + netCounters;
  const currentToughness = (token.toughness ?? 0) + netCounters;

  // Use actual card dimensions if provided, otherwise fallback to default
  const tooltipWidth = position.width || 140;
  const tooltipHeight = position.height || 196;
  
  // Smart positioning: place tooltip above card if in top half, below if in bottom half
  const viewportHeight = window.innerHeight;
  const isInTopHalf = position.y < viewportHeight / 2;
  const tooltipY = isInTopHalf ? position.y + (position.height || 196) / 2 + 10 : position.y - (position.height || 196) / 2 - 10;

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${tooltipY}px`,
        transform: 'translate(-50%, 0)', // Center horizontally only
      }}
      onClick={(e) => {
        e.stopPropagation(); // Don't propagate to card below
        // Tooltip will dismiss on mouse leave
      }}
    >
      <div 
        className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border-2 border-indigo-500/30 p-4 animate-fade-in overflow-y-auto cursor-default"
        style={{ 
          width: `${tooltipWidth}px`,
          height: `${tooltipHeight}px`,
          fontSize: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="font-bold text-sm mb-2 pb-2 border-b-2 border-indigo-500/30 line-clamp-2">
          {token.name}
        </div>

        {/* Type and Colors */}
        <div className="text-[10px] space-y-1 mb-2 flex-shrink-0">
          {isCreature && (
            <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-2 py-1">
              <span className="text-slate-400 font-medium">P/T:</span>
              <span className="font-bold text-indigo-300">
                {currentPower}/{currentToughness}
                {netCounters !== 0 && (
                  <span className="text-xs text-slate-500 ml-1">
                    ({token.power}/{token.toughness})
                  </span>
                )}
              </span>
            </div>
          )}
          
          {token.colors.length > 0 && (
            <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-2 py-1">
              <span className="text-slate-400 font-medium">Colors:</span>
              <span className="font-bold text-indigo-300 capitalize">{token.colors.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Abilities */}
        {token.abilities && (
          <div className="text-[10px] mb-2 flex-1 min-h-0">
            <div className="text-slate-400 mb-1 text-[9px] font-semibold">Abilities:</div>
            <div className="bg-slate-800/70 rounded-lg p-2 text-[9px] leading-tight overflow-y-auto max-h-[60px] border border-slate-700/50">
              {parseManaSymbols(token.abilities)}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-[10px] space-y-1 border-t-2 border-indigo-500/30 pt-2 flex-shrink-0">
          <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-medium">Status:</span>
            <span className="font-bold">
              {token.isTapped && <span className="text-cyan-400">⟲ Tapped</span>}
              {token.hasSummoningSickness && <span className="text-amber-400">⚡ Sick</span>}
              {!token.isTapped && !token.hasSummoningSickness && <span className="text-emerald-400">✓ Ready</span>}
            </span>
          </div>
          
          {plusCounters > 0 && (
            <div className="flex justify-between items-center bg-emerald-900/30 rounded-lg px-2 py-1 border border-emerald-500/30">
              <span className="text-emerald-300 font-medium">+1/+1:</span>
              <span className="font-bold text-emerald-400">+{plusCounters}</span>
            </div>
          )}
          
          {minusCounters > 0 && (
            <div className="flex justify-between items-center bg-rose-900/30 rounded-lg px-2 py-1 border border-rose-500/30">
              <span className="text-rose-300 font-medium">-1/-1:</span>
              <span className="font-bold text-rose-400">-{minusCounters}</span>
            </div>
          )}

          {/* Custom Counters */}
          {token.counters && token.counters.filter(c => c.count > 0).length > 0 && (
            <div className="border-t border-slate-700/50 pt-1.5 mt-1.5 space-y-1">
              <div className="text-slate-400 mb-1 text-[9px] font-semibold">Other Counters:</div>
              {token.counters
                .filter(c => c.count > 0)
                .map((counter, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-purple-900/30 rounded-lg px-2 py-1 border border-purple-500/30 text-[9px]">
                    <span className="text-purple-300 font-medium">{counter.icon || '📍'} {counter.type}:</span>
                    <span className="font-bold text-purple-400">{counter.count}</span>
                  </div>
                ))}
            </div>
          )}

          {token.attachments && token.attachments.length > 0 && (
            <div className="border-t border-slate-700/50 pt-1.5 mt-1.5">
              <div className="text-slate-400 mb-1 text-[10px] font-semibold">Attachments:</div>
              {token.attachments.map((attachment, idx) => (
                <div key={idx} className="text-[10px] bg-slate-800/70 rounded-lg p-2 mb-1 border border-slate-700/50">
                  <div className="font-bold text-indigo-300">{attachment.name}</div>
                  <div className="text-slate-400 mt-0.5">{attachment.effect}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};