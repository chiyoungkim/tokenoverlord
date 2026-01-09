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

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)', // Center on card
      }}
    >
      <div 
        className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 animate-fade-in overflow-y-auto"
        style={{ 
          width: `${tooltipWidth}px`,
          height: `${tooltipHeight}px`,
          fontSize: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="font-bold text-xs mb-1 border-b border-gray-700 pb-1 line-clamp-2">
          {token.name}
        </div>

        {/* Type and Colors */}
        <div className="text-[10px] space-y-0.5 mb-1 flex-shrink-0">
          {isCreature && (
            <div className="flex justify-between">
              <span className="text-gray-400">Power/Toughness:</span>
              <span className="font-semibold">
                {currentPower}/{currentToughness}
                {netCounters !== 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    (base: {token.power}/{token.toughness})
                  </span>
                )}
              </span>
            </div>
          )}
          
          {token.colors.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Colors:</span>
              <span className="font-semibold capitalize">{token.colors.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Abilities */}
        {token.abilities && (
          <div className="text-[10px] mb-1 flex-1 min-h-0">
            <div className="text-gray-400 mb-0.5 text-[9px]">Abilities:</div>
            <div className="bg-gray-800 rounded p-1 text-[9px] leading-tight overflow-y-auto max-h-[60px]">
              {parseManaSymbols(token.abilities)}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-[10px] space-y-0.5 border-t border-gray-700 pt-1 flex-shrink-0">
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className="font-semibold">
              {token.isTapped && '⟲ Tapped '}
              {token.hasSummoningSickness && '⚡ Summoning Sick '}
              {!token.isTapped && !token.hasSummoningSickness && '✓ Ready'}
            </span>
          </div>
          
          {plusCounters > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">+1/+1 Counters:</span>
              <span className="font-semibold text-green-400">+{plusCounters}</span>
            </div>
          )}
          
          {minusCounters > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">-1/-1 Counters:</span>
              <span className="font-semibold text-red-400">-{minusCounters}</span>
            </div>
          )}

          {/* Custom Counters */}
          {token.counters && token.counters.filter(c => c.count > 0).length > 0 && (
            <div className="border-t border-gray-700 pt-1 mt-1">
              <div className="text-gray-400 mb-0.5 text-[9px]">Other Counters:</div>
              {token.counters
                .filter(c => c.count > 0)
                .map((counter, idx) => (
                  <div key={idx} className="flex justify-between text-[9px]">
                    <span className="text-gray-400">{counter.icon || '📍'} {counter.type}:</span>
                    <span className="font-semibold text-purple-400">{counter.count}</span>
                  </div>
                ))}
            </div>
          )}

          {token.attachments && token.attachments.length > 0 && (
            <div className="border-t border-gray-700 pt-1 mt-1">
              <div className="text-gray-400 mb-0.5 text-[10px]">Attachments:</div>
              {token.attachments.map((attachment, idx) => (
                <div key={idx} className="text-[10px] bg-gray-800 rounded p-1 mb-0.5">
                  <div className="font-semibold">{attachment.name}</div>
                  <div className="text-gray-400">{attachment.effect}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};