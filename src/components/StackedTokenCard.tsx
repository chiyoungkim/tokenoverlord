import { useState, useRef } from 'react';
import type { Token } from '../types/token';
import { getColorGradient, getColorBorder, isLightColor } from '../utils/colors';
import { TokenTooltip } from './TokenTooltip';
import { AttachmentManager } from './AttachmentManager';
import { parseManaSymbols } from '../utils/manaSymbols';
import { Paperclip } from 'lucide-react';

interface StackedTokenCardProps {
  token: Token;
  count: number;
  onTap: () => void;
  onClickCount: () => void;
  onTapAll: () => void;
  onUntapAll: () => void;
  onRemoveSummoningSicknessAll: () => void;
  onRemoveAttachment: (tokenId: string, attachmentName: string) => void;
  onAddAttachmentToAll: (attachment: import('../types/token').Attachment) => void;
}

export const StackedTokenCard: React.FC<StackedTokenCardProps> = ({
  token,
  count,
  onTap,
  onClickCount,
  onTapAll,
  onUntapAll,
  onRemoveSummoningSicknessAll,
  onRemoveAttachment,
  onAddAttachmentToAll,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [attachmentManagerOpen, setAttachmentManagerOpen] = useState(false);
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
    if (!tooltipDismissed) {
      tooltipTimeout.current = setTimeout(() => setTooltipVisible(true), 500);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setTooltipVisible(false);
    setTooltipDismissed(false);
  };
  const isCreature = token.power !== null && token.toughness !== null;
  const useDarkText = isLightColor(token.colors);
  
  const plusCounters = token.plusOneCounters ?? 0;
  const minusCounters = token.minusOneCounters ?? 0;
  const netCounters = plusCounters - minusCounters;
  const displayPlusCounters = netCounters > 0 ? netCounters : 0;
  const displayMinusCounters = netCounters < 0 ? Math.abs(netCounters) : 0;
  
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
      <TokenTooltip 
        token={token} 
        visible={tooltipVisible} 
        position={tooltipPosition}
        onDismiss={() => {
          setTooltipVisible(false);
          setTooltipDismissed(true);
        }}
      />
      
      {/* Stacked card effect - bottom layers (only show when untapped) */}
      {!token.isTapped && (
        <>
          <div
            className="absolute top-1.5 left-1.5 w-full h-full rounded-lg border-2 border-gray-400 opacity-30 shadow-md"
            style={{
              ...(token.imageUrl ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${token.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {
                background: getColorGradient(token.colors),
              }),
            }}
          />
          <div
            className="absolute top-1 left-1 w-full h-full rounded-lg border-2 border-gray-400 opacity-50 shadow-lg"
            style={{
              ...(token.imageUrl ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${token.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {
                background: getColorGradient(token.colors),
              }),
            }}
          />
        </>
      )}
      
      {/* Main card */}
      <div
        className={`relative w-full aspect-[2.5/2] rounded-lg border-2 ${getColorBorder(
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
        }}
        onClick={onTap}
      >
        {/* Dying Indicator */}
        {isDying && (
          <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1 z-10 rounded-t-md">
            💀 DESTROY?
          </div>
        )}

        {/* Card Header - Name */}
        <div className={`absolute top-0 left-0 right-0 p-2 ${isDying ? 'mt-6' : ''} bg-black bg-opacity-60 text-white text-xs font-semibold rounded-t-md break-words line-clamp-2`}>
          {token.name}
        </div>

        {/* COUNT BADGE - Upper right, below name banner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClickCount();
          }}
          className="absolute top-8 right-2 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-base sm:text-sm font-black rounded-full w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center shadow-xl z-20 border-2 border-white ring-4 ring-indigo-300/50 transition-all active:scale-95"
        >
          ×{count}
        </button>

        {/* TAP ALL BUTTON - Left side, middle (only when untapped) */}
        {!token.isTapped && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTapAll();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20 border-2 border-white transition-colors"
            title="Tap All"
          >
            <i className="ms ms-tap" style={{ fontSize: '20px' }} />
          </button>
        )}

        {/* UNTAP ALL BUTTON - Right side, middle (only when tapped) */}
        {token.isTapped && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUntapAll();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20 border-2 border-white transition-colors"
            title="Untap All"
          >
            <i className="ms ms-untap" style={{ fontSize: '20px' }} />
          </button>
        )}

        {/* Center - Visual indicators */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pt-12 pb-12">
          <div className="flex flex-col items-center gap-2">
            {/* Summoning Sickness Badge - Clickable */}
            {token.hasSummoningSickness && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSummoningSicknessAll();
                }}
                className={`${
                  useDarkText ? 'bg-yellow-600' : 'bg-yellow-500'
                } text-white text-sm font-bold rounded-full w-12 h-12 flex flex-col items-center justify-center shadow-lg border-2 border-white summoning-sick-shimmer cursor-pointer hover:bg-yellow-600 transition-colors`}
                title="Click to remove summoning sickness from all"
              >
                <div className="text-[8px] leading-tight px-1">Summoning<br/>Sickness</div>
              </button>
            )}
            
            {/* +1/+1 Counter Badge - Shows for all tokens */}
            {displayPlusCounters > 0 && (
              <div className="bg-green-600 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-green-300">
                +{displayPlusCounters}
              </div>
            )}
            
            {/* -1/-1 Counter Badge - Shows for all tokens */}
            {displayMinusCounters > 0 && (
              <div className="bg-red-600 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-red-300">
                -{displayMinusCounters}
              </div>
            )}

            {/* Attachments Display */}
            {token.attachments && token.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center max-w-full">
                {token.attachments.map((attachment, idx) => (
                  <div
                    key={`${attachment.name}-${idx}`}
                    className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border-2 border-amber-200 ring-2 ring-amber-400/30"
                    title={attachment.effect || attachment.name}
                  >
                    <Paperclip size={12} />
                    <span className="max-w-[100px] truncate">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Abilities or Background P/T */}
            {token.abilities && !isCreature ? (
              <div className={`text-xs text-center ${useDarkText ? 'text-gray-900' : 'text-white'} bg-white bg-opacity-80 p-2 rounded max-h-full overflow-hidden break-words line-clamp-4`}>
                {parseManaSymbols(token.abilities)}
              </div>
            ) : !token.abilities && (
              <div className={`text-4xl font-bold ${useDarkText ? 'text-gray-900' : 'text-white'} opacity-20`}>
                {isCreature ? `${token.power}/${token.toughness}` : token.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Power/Toughness for creatures */}
        {isCreature && (
          <div className={`absolute bottom-1 right-1 ${
            isDying ? 'bg-red-600' : 'bg-gray-900'
          } text-white text-sm font-bold px-2 py-1 rounded border-2 border-white shadow-lg`}>
            {currentPower}/{currentToughness}
          </div>
        )}

        {/* Attachment Button - Bottom left, always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAttachmentManagerOpen(true);
          }}
          className="absolute bottom-2 left-2 p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white rounded-full shadow-xl transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
          title="Manage attachments for all"
        >
          <Paperclip size={14} />
        </button>
      </div>

      {/* Attachment Manager Modal */}
      <AttachmentManager
        token={token}
        isOpen={attachmentManagerOpen}
        onClose={() => setAttachmentManagerOpen(false)}
        onAddAttachment={(attachment) => onAddAttachmentToAll(attachment)}
        onRemoveAttachment={(name) => onRemoveAttachment(token.id, name)}
      />
    </div>
  );
};