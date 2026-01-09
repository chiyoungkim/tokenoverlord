import { useState, useRef } from 'react';
import type { Token } from '../types/token';
import { getColorGradient, getColorBorder, isLightColor } from '../utils/colors';
import { Plus, Minus, Copy, Trash2, Hash } from 'lucide-react';
import { TokenTooltip } from './TokenTooltip';
import { CounterManager } from './CounterManager';
import { parseManaSymbols } from '../utils/manaSymbols';

interface TokenCardProps {
  token: Token;
  onTap: () => void;
  onAddCounter: () => void;
  onRemoveCounter: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRemoveSummoningSickness: () => void;
  onAddCustomCounter: (counterType: string, icon?: string) => void;
  onRemoveCustomCounter: (counterType: string) => void;
  onSetCounterAmount: (counterType: string, amount: number) => void;
  onUpdateCounterIcon: (counterType: string, icon: string) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onTap,
  onAddCounter,
  onRemoveCounter,
  onDuplicate,
  onDelete,
  onRemoveSummoningSickness,
  onAddCustomCounter,
  onRemoveCustomCounter,
  onSetCounterAmount,
  onUpdateCounterIcon,
}) => {
  // Debug: Log token image URL and background calculation
  console.log(`🖼️ TokenCard rendering: ${token.name}`, {
    imageUrl: token.imageUrl,
    hasImageUrl: !!token.imageUrl,
    imageUrlType: typeof token.imageUrl,
    willUseImage: token.imageUrl ? 'YES' : 'NO',
    backgroundImage: token.imageUrl 
      ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${token.imageUrl})`
      : 'NONE',
  });
  
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [counterManagerOpen, setCounterManagerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<number | null>(null);
  
  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
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
    <div 
      className="relative group" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TokenTooltip token={token} visible={tooltipVisible} position={tooltipPosition} />
      
      <div 
        className={`w-full ${token.isTapped ? 'h-[70%]' : 'aspect-[2.5/2]'}`}
      >
        <div
          className={`${token.isTapped ? 'w-full h-auto absolute top-0 left-0' : 'w-full h-full'} rounded-lg border-2 ${getColorBorder(
            token.colors
          )} token-card-shadow cursor-pointer transition-all hover:scale-105 ${
            token.isTapped ? 'opacity-75' : ''
          } ${token.hasSummoningSickness ? 'summoning-sick-ring' : ''} ${
            isDying ? 'ring-4 ring-red-600 ring-offset-2' : ''
          }`}
          style={{
            ...(token.imageUrl ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${token.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {
              background: getColorGradient(token.colors),
            }),
            transform: token.isTapped ? 'rotate(90deg) scale(0.7)' : 'none',
            transformOrigin: 'center center',
            aspectRatio: '2.5 / 2',
          }}
          onClick={onTap}
        >
      {/* Dying Indicator */}
      {isDying && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1 z-10 rounded-t-md">
          💀 DESTROY?
        </div>
      )}

      {/* Card Header - Name with wrapping - Mobile optimized */}
      <div className={`absolute top-0 left-0 right-0 p-2 ${isDying ? 'mt-6' : ''} bg-black bg-opacity-70 text-white text-sm sm:text-xs font-bold sm:font-semibold rounded-t-md break-words line-clamp-2 z-20`}>
        {token.name}
      </div>

      {/* Abilities Text Box - Full width, below name, only for non-creatures */}
      {token.abilities && !isCreature && (
        <div className={`absolute ${isDying ? 'top-16' : 'top-10'} left-0 right-0 mx-1 text-xs text-gray-900 font-medium bg-white bg-opacity-95 px-2 py-1.5 rounded-lg overflow-hidden break-words line-clamp-3 z-10`}>
          {parseManaSymbols(token.abilities)}
        </div>
      )}

      {/* Center - Visual indicators only */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pt-16 pb-12">
        <div className="flex flex-col items-center gap-2">
          {/* Summoning Sickness Badge - Mobile optimized */}
          {token.hasSummoningSickness && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSummoningSickness();
              }}
              className={`${
                useDarkText ? 'bg-yellow-600' : 'bg-yellow-500'
              } text-white text-xs sm:text-sm font-bold rounded-full w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center shadow-lg border-2 border-white summoning-sick-shimmer cursor-pointer hover:bg-yellow-600 transition-colors`}
              title="Click to remove summoning sickness"
            >
              <div className="text-[9px] sm:text-[8px] leading-tight px-1">Summoning<br/>Sickness</div>
            </button>
          )}
          
          {/* +1/+1 Counter Badge - Enhanced Design */}
          {displayPlusCounters > 0 && (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-base font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-xl border-2 border-emerald-200 ring-4 ring-emerald-400/30">
              +{displayPlusCounters}
            </div>
          )}
          
          {/* -1/-1 Counter Badge - Enhanced Design */}
          {displayMinusCounters > 0 && (
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-base font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-xl border-2 border-rose-200 ring-4 ring-rose-400/30">
              -{displayMinusCounters}
            </div>
          )}

          {/* Custom Counter Badges - Enhanced Pill Design */}
          {token.counters && token.counters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full">
              {token.counters
                .filter(c => c.count > 0)
                .map((counter, idx) => (
                  <button
                    key={`${counter.type}-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomCounter(counter.type);
                    }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-95 text-white text-xs font-bold rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border-2 border-purple-200 ring-2 ring-purple-400/30 transition-all cursor-pointer"
                    title={`${counter.type}: ${counter.count} (click to remove 1)`}
                  >
                    <span className="text-base">{counter.icon || '📍'}</span>
                    <span>{counter.count}</span>
                  </button>
                ))}
            </div>
          )}

          {/* Background P/T or Initial - Only show if no abilities text */}
          {!token.abilities && (
            <div className={`text-4xl font-bold ${useDarkText ? 'text-gray-900' : 'text-white'} opacity-20`}>
              {isCreature ? `${token.power}/${token.toughness}` : token.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Base P/T Watermark - Always bottom-right background for consistency */}
      {isCreature && (
        <div className="absolute bottom-2 right-2 text-6xl font-bold text-white opacity-10 pointer-events-none leading-none">
          {token.power}/{token.toughness}
        </div>
      )}

      {/* Power/Toughness for creatures - High contrast (shows current with counters) */}
      {isCreature && (
        <div className={`absolute bottom-1 right-1 ${
          isDying ? 'bg-red-600' : 'bg-gray-900'
        } text-white text-sm font-bold px-2 py-1 rounded border-2 border-white shadow-lg z-10`}>
          {currentPower}/{currentToughness}
        </div>
      )}

      {/* Action buttons - Show only when card is tapped or on desktop hover */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Left 3/4 up: Add Counter */}
        <button
          className="absolute top-[25%] left-2 p-2.5 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 pointer-events-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onAddCounter();
          }}
          onMouseEnter={() => {
            if (tooltipTimeout.current) {
              clearTimeout(tooltipTimeout.current);
            }
            setTooltipVisible(false);
          }}
          title="Add +1/+1 counter"
        >
          <Plus size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Right 3/4 up: Remove Counter */}
        <button
          className="absolute top-[25%] right-2 p-2.5 sm:p-3 bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 pointer-events-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveCounter();
          }}
          onMouseEnter={() => {
            if (tooltipTimeout.current) {
              clearTimeout(tooltipTimeout.current);
            }
            setTooltipVisible(false);
          }}
          title="Remove +1/+1 counter (or add -1/-1)"
        >
          <Minus size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Bottom-left: Duplicate */}
        <button
          className="absolute bottom-2 left-2 p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 pointer-events-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          onMouseEnter={() => {
            if (tooltipTimeout.current) {
              clearTimeout(tooltipTimeout.current);
            }
            setTooltipVisible(false);
          }}
          title="Duplicate token"
        >
          <Copy size={16} className="sm:w-5 sm:h-5" />
        </button>

        {/* Bottom-center: Counters */}
        <button
          className="absolute bottom-2 left-1/2 -translate-x-1/2 p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 pointer-events-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setCounterManagerOpen(true);
          }}
          onMouseEnter={() => {
            if (tooltipTimeout.current) {
              clearTimeout(tooltipTimeout.current);
            }
            setTooltipVisible(false);
          }}
          title="Manage counters"
        >
          <Hash size={16} className="sm:w-5 sm:h-5" />
        </button>

        {/* Bottom-right: Delete */}
        <button
          className="absolute bottom-2 right-2 p-1.5 sm:p-2 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 pointer-events-auto z-50 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            console.log('Delete button clicked!');
            e.stopPropagation();
            onDelete();
          }}
          onMouseEnter={() => {
            if (tooltipTimeout.current) {
              clearTimeout(tooltipTimeout.current);
            }
            setTooltipVisible(false);
          }}
          title="Delete token"
        >
          <Trash2 size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>
      </div>
      </div>

      {/* Counter Manager Modal */}
      <CounterManager
        token={token}
        isOpen={counterManagerOpen}
        onClose={() => setCounterManagerOpen(false)}
        onAddCounter={onAddCustomCounter}
        onRemoveCounter={onRemoveCustomCounter}
        onSetAmount={onSetCounterAmount}
        onUpdateIcon={onUpdateCounterIcon}
      />
    </div>
  );
};