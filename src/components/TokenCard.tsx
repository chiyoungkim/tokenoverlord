import { useState, useRef } from 'react';
import type { Token } from '../types/token';
import { getColorGradient, getColorBorder, isLightColor } from '../utils/colors';
import { Plus, Minus, Copy, Trash2 } from 'lucide-react';
import { TokenTooltip } from './TokenTooltip';

interface TokenCardProps {
  token: Token;
  onTap: () => void;
  onAddCounter: () => void;
  onRemoveCounter: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onTap,
  onAddCounter,
  onRemoveCounter,
  onDuplicate,
  onDelete,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<number | null>(null);
  
  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2, // Center of card
      });
    }
    // Delay tooltip to avoid flicker
    tooltipTimeout.current = setTimeout(() => setTooltipVisible(true), 500);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setTooltipVisible(false);
  };
  const isCreature = token.power !== null && token.toughness !== null;
  const useDarkText = isLightColor(token.colors);
  
  // Fallback for tokens created before minusOneCounters was added
  const plusCounters = token.plusOneCounters ?? 0;
  const minusCounters = token.minusOneCounters ?? 0;
  
  // Counters cancel each other out - only show the net
  const netCounters = plusCounters - minusCounters;
  const displayPlusCounters = netCounters > 0 ? netCounters : 0;
  const displayMinusCounters = netCounters < 0 ? Math.abs(netCounters) : 0;
  
  // Calculate final P/T
  const currentPower = (token.power ?? 0) + netCounters;
  const currentToughness = (token.toughness ?? 0) + netCounters;
  const isDying = isCreature && currentToughness <= 0;
  
  return (
    <div className="relative group" ref={cardRef}>
      <TokenTooltip token={token} visible={tooltipVisible} position={tooltipPosition} />
      
      <div
        className={`w-full aspect-[2.5/3.5] rounded-lg border-2 ${getColorBorder(
          token.colors
        )} token-card-shadow cursor-pointer transition-all hover:scale-105 ${
          token.isTapped ? 'opacity-75' : ''
        } ${token.hasSummoningSickness ? 'summoning-sick-ring' : ''} ${
          isDying ? 'ring-4 ring-red-600 ring-offset-2' : ''
        }`}
        style={{
          background: getColorGradient(token.colors),
          transform: token.isTapped ? 'rotate(90deg) scale(0.7)' : 'none',
        }}
        onClick={onTap}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {/* Dying Indicator */}
      {isDying && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1 z-10 rounded-t-md">
          💀 DESTROY?
        </div>
      )}

      {/* Card Header - Name with wrapping */}
      <div className={`absolute top-0 left-0 right-0 p-2 ${isDying ? 'mt-6' : ''} bg-black bg-opacity-60 text-white text-xs font-semibold rounded-t-md break-words line-clamp-2`}>
        {token.name}
      </div>

      {/* Center - Visual indicators and abilities */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pt-12 pb-12">
        <div className="flex flex-col items-center gap-2">
          {/* Summoning Sickness Badge - Center */}
          {token.hasSummoningSickness && (
            <div className={`${
              useDarkText ? 'bg-yellow-600' : 'bg-yellow-500'
            } text-white text-sm font-bold rounded-full w-12 h-12 flex flex-col items-center justify-center shadow-lg border-2 border-white summoning-sick-shimmer`}>
              <div className="text-[8px] leading-tight px-1">Summoning<br/>Sickness</div>
            </div>
          )}
          
          {/* +1/+1 Counter Badge - Shows for all tokens */}
          {displayPlusCounters > 0 && (
            <div className="bg-green-600 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white">
              +{displayPlusCounters}
            </div>
          )}
          
          {/* -1/-1 Counter Badge - Shows for all tokens */}
          {displayMinusCounters > 0 && (
            <div className="bg-red-600 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white">
              -{displayMinusCounters}
            </div>
          )}

          {/* Abilities or Background P/T */}
          {token.abilities && !isCreature ? (
            <div className={`text-xs text-center ${useDarkText ? 'text-gray-900' : 'text-white'} bg-white bg-opacity-80 p-2 rounded max-h-full overflow-hidden break-words line-clamp-4`}>
              {token.abilities}
            </div>
          ) : !token.abilities && (
            <div className={`text-4xl font-bold ${useDarkText ? 'text-gray-900' : 'text-white'} opacity-20`}>
              {isCreature ? `${token.power}/${token.toughness}` : token.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Power/Toughness for creatures - High contrast */}
      {isCreature && (
        <div className={`absolute bottom-1 right-1 ${
          isDying ? 'bg-red-600' : 'bg-gray-900'
        } text-white text-sm font-bold px-2 py-1 rounded border-2 border-white shadow-lg`}>
          {currentPower}/{currentToughness}
        </div>
      )}

      {/* Action buttons - Always visible */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Top-left: Add Counter */}
        <button
          className="absolute top-2 left-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onAddCounter();
          }}
          title="Add +1/+1 counter"
        >
          <Plus size={20} />
        </button>

        {/* Top-right: Remove Counter */}
        <button
          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveCounter();
          }}
          title="Remove +1/+1 counter (or add -1/-1)"
        >
          <Minus size={20} />
        </button>

        {/* Bottom-left: Duplicate */}
        <button
          className="absolute bottom-2 left-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate token"
        >
          <Copy size={20} />
        </button>

        {/* Bottom-right: Delete */}
        <button
          className="absolute bottom-2 right-2 p-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transition-colors pointer-events-auto z-50"
          onClick={(e) => {
            console.log('Delete button clicked!');
            e.stopPropagation();
            onDelete();
          }}
          title="Delete token"
        >
          <Trash2 size={20} />
        </button>
      </div>
      </div>
    </div>
  );
};