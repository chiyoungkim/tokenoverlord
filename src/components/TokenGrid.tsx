import { useState, useEffect } from 'react';
import { useTokenStore } from '../store/tokenStore';
import { useSettingsStore } from '../store/settingsStore';
import { TokenCard } from './TokenCard';
import { StackedTokenCard } from './StackedTokenCard';
import { StackModal } from './StackModal';
import { ToastContainer, useToasts } from './Toast';
import { groupTokens } from '../utils/tokenGrouping';

export const TokenGrid: React.FC = () => {
  const { 
    tokens, 
    toggleTap, 
    addCounter, 
    removeCounter, 
    duplicateToken, 
    moveToGraveyard 
  } = useTokenStore();
  
  const { autoStackEnabled, minStackSize, cardSize } = useSettingsStore();
  
  const { toasts, addToast, dismissToast } = useToasts();
  
  const [expandedTokenIds, setExpandedTokenIds] = useState<Set<string>>(new Set());
  const [prevTokenCount, setPrevTokenCount] = useState(tokens.length);

  // Determine grid columns based on card size
  const gridCols = {
    small: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
    medium: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6',
    large: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }[cardSize];

  // Group tokens if auto-stack is enabled
  const groups = autoStackEnabled 
    ? groupTokens(tokens, minStackSize)
    : tokens.map(token => ({
        key: token.id,
        tokens: [token],
        count: 1,
        isExpanded: false,
        representative: token,
      }));

  // Detect when tokens get added to stacks
  useEffect(() => {
    if (tokens.length > prevTokenCount) {
      // Token was added
      const diff = tokens.length - prevTokenCount;
      if (autoStackEnabled && diff > 0) {
        addToast(`Added ${diff} token${diff > 1 ? 's' : ''}`, 'success');
      }
    }
    setPrevTokenCount(tokens.length);
  }, [tokens.length, prevTokenCount, autoStackEnabled, addToast]);

  // Find expanded tokens by IDs (persists across re-grouping)
  const expandedTokens = expandedTokenIds.size > 0
    ? tokens.filter(t => expandedTokenIds.has(t.id))
    : [];

  // Quick action handlers for modal
  const handleTapHalf = () => {
    if (expandedTokens.length === 0) return;
    const halfCount = Math.floor(expandedTokens.length / 2);
    expandedTokens.slice(0, halfCount).forEach(t => {
      if (!t.isTapped) toggleTap(t.id);
    });
  };

  const handleSplit = (count: number) => {
    if (expandedTokens.length === 0) return;
    // Split by tapping the first 'count' tokens
    expandedTokens.slice(0, count).forEach(t => {
      toggleTap(t.id);
    });
    setExpandedTokenIds(new Set());
  };

  const handleAddCounterToAll = () => {
    if (expandedTokens.length === 0) return;
    expandedTokens.forEach(t => addCounter(t.id));
  };

  const handleRemoveCounterToAll = () => {
    if (expandedTokens.length === 0) return;
    expandedTokens.forEach(t => removeCounter(t.id));
  };

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🃏</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Tokens Yet</h2>
        <p className="text-gray-500 max-w-md">
          Tap a button above to create your first token, or use the Custom button for more options.
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <div className={`grid ${gridCols} gap-4 p-4 pb-24 card-size-${cardSize}`}>
        {groups.map((group) => {
          if (group.count === 1) {
            // Single token - use regular TokenCard
            const token = group.tokens[0];
            return (
              <TokenCard
                key={token.id}
                token={token}
                onTap={() => toggleTap(token.id)}
                onAddCounter={() => addCounter(token.id)}
                onRemoveCounter={() => removeCounter(token.id)}
                onDuplicate={() => duplicateToken(token.id)}
                onDelete={() => {
                  console.log('TokenGrid onDelete called for:', token.name);
                  if (window.confirm(`Move ${token.name} to graveyard?`)) {
                    console.log('Confirmed, calling moveToGraveyard');
                    moveToGraveyard(token.id);
                    addToast(`${token.name} moved to graveyard`, 'info');
                  }
                }}
              />
            );
          } else {
            // Stacked tokens - use StackedTokenCard
            return (
              <StackedTokenCard
                key={group.key}
                token={group.representative}
                count={group.count}
                onTap={() => setExpandedTokenIds(new Set(group.tokens.map(t => t.id)))}
                onClickCount={() => setExpandedTokenIds(new Set(group.tokens.map(t => t.id)))}
                onTapAll={() => {
                  // Tap all untapped tokens in this group
                  group.tokens.forEach(t => {
                    if (!t.isTapped) toggleTap(t.id);
                  });
                }}
                onUntapAll={() => {
                  // Untap all tapped tokens in this group
                  group.tokens.forEach(t => {
                    if (t.isTapped) toggleTap(t.id);
                  });
                }}
              />
            );
          }
        })}
      </div>

      {/* Stack Modal */}
      {expandedTokens.length > 0 && (
        <StackModal
          tokens={expandedTokens}
          isOpen={expandedTokens.length > 0}
          onClose={() => setExpandedTokenIds(new Set())}
          onTapHalf={handleTapHalf}
          onSplit={handleSplit}
          onAddCounterToAll={handleAddCounterToAll}
          onRemoveCounterToAll={handleRemoveCounterToAll}
          onToggleTap={toggleTap}
          onAddCounter={addCounter}
          onRemoveCounter={removeCounter}
          onDuplicate={duplicateToken}
          onDelete={(id) => {
            const token = tokens.find(t => t.id === id);
            moveToGraveyard(id);
            if (token) {
              addToast(`${token.name} moved to graveyard`, 'info');
            }
            // Remove from expanded set
            setExpandedTokenIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
          }}
        />
      )}
    </>
  );
};