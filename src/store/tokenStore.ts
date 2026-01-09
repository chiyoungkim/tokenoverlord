import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Token, TokenTemplate, Attachment } from '../types/token';
import { COUNTER_TYPES } from '../types/token';
import { getScryfallData } from '../hooks/useScryfallData';

interface TokenStore {
  tokens: Token[];
  graveyard: Token[];
  customTemplates: TokenTemplate[];
  selectedTokens: Set<string>; // For multi-select
  
  // Token operations
  addToken: (template: TokenTemplate, quantity?: number) => void;
  removeToken: (id: string) => void;
  moveToGraveyard: (id: string) => void;
  restoreFromGraveyard: (token: Token) => void;
  clearGraveyard: () => void;
  toggleTap: (id: string) => void;
  tapAll: () => void;
  untapAll: () => void;
  addCounter: (id: string) => void;
  removeCounter: (id: string) => void;
  addCustomCounter: (id: string, counterType: string, icon?: string) => void;
  removeCustomCounter: (id: string, counterType: string) => void;
  setCounterAmount: (id: string, counterType: string, amount: number) => void;
  updateCounterIcon: (id: string, counterType: string, icon: string) => void;
  clearSummoningSickness: () => void;
  removeSummoningSickness: (id: string) => void;
  clearAll: () => void;
  duplicateToken: (id: string) => void;
  
  // Attachment operations
  addAttachment: (tokenId: string, attachment: Attachment) => void;
  removeAttachment: (tokenId: string, attachmentName: string) => void;
  
  // Multi-select operations
  toggleSelectToken: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  transformSelected: (newTemplate: Partial<Token>) => void;
  
  // Template operations
  saveTemplate: (template: TokenTemplate) => void;
  removeTemplate: (name: string) => void;
}

const createTokenFromTemplate = (template: TokenTemplate): Token => {
  // Check for Scryfall data
  const scryfallData = getScryfallData(template.name);
  
  console.log(`🎴 Creating token: ${template.name}`, {
    templateImageUrl: template.imageUrl,
    scryfallImageUrl: scryfallData.imageUrl,
    templateAbilities: template.abilities,
    scryfallOracleText: scryfallData.oracleText,
    finalImageUrl: template.imageUrl || scryfallData.imageUrl,
    finalAbilities: template.abilities || scryfallData.oracleText,
  });
  
  return {
    id: crypto.randomUUID(),
    name: template.name,
    power: template.power,
    toughness: template.toughness,
    colors: [...template.colors],
    abilities: template.abilities || scryfallData.oracleText || undefined,
    imageUrl: template.imageUrl || scryfallData.imageUrl || undefined,
    isTapped: false,
    hasSummoningSickness: !template.hasHaste, // No summoning sickness if has haste
    hasHaste: template.hasHaste || false,
    plusOneCounters: 0,
    minusOneCounters: 0,
    counters: [], // Initialize empty counters array
    attachments: [],
    createdAt: Date.now(),
  };
};

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      graveyard: [],
      customTemplates: [],
      selectedTokens: new Set<string>(),

      addToken: (template: TokenTemplate, quantity: number = 1) => {
        const newTokens = Array.from({ length: quantity }, () => 
          createTokenFromTemplate(template)
        );
        set((state) => ({ tokens: [...state.tokens, ...newTokens] }));
      },

      removeToken: (id: string) => {
        set((state) => ({
          tokens: state.tokens.filter((token) => token.id !== id),
        }));
      },

      moveToGraveyard: (id: string) => {
        const token = get().tokens.find((t) => t.id === id);
        if (token) {
          set((state) => {
            // Ensure selectedTokens is a Set
            const selectedSet = state.selectedTokens instanceof Set 
              ? state.selectedTokens 
              : new Set(Array.isArray(state.selectedTokens) ? state.selectedTokens : []);
            
            return {
              tokens: state.tokens.filter((t) => t.id !== id),
              graveyard: [...state.graveyard, token],
              selectedTokens: new Set([...selectedSet].filter(tid => tid !== id)),
            };
          });
        }
      },

      restoreFromGraveyard: (token: Token) => {
        // Create new token with new ID but same properties
        const restoredToken: Token = {
          ...token,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          hasSummoningSickness: true,
        };
        set((state) => ({
          tokens: [...state.tokens, restoredToken],
          graveyard: state.graveyard.filter((t) => t.id !== token.id),
        }));
      },

      clearGraveyard: () => {
        set({ graveyard: [] });
      },

      toggleTap: (id: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.id === id ? { ...token, isTapped: !token.isTapped } : token
          ),
        }));
      },

      tapAll: () => {
        set((state) => ({
          tokens: state.tokens.map((token) => ({ ...token, isTapped: true })),
        }));
      },

      untapAll: () => {
        set((state) => ({
          tokens: state.tokens.map((token) => ({ ...token, isTapped: false })),
        }));
      },

      addCounter: (id: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const minusCounters = token.minusOneCounters ?? 0;
            const plusCounters = token.plusOneCounters ?? 0;
            
            // If we have -1/-1 counters, cancel them out first
            if (minusCounters > 0) {
              return { 
                ...token, 
                minusOneCounters: minusCounters - 1,
                plusOneCounters: plusCounters // Ensure field exists
              };
            }
            
            // Otherwise, add a +1/+1 counter
            return { 
              ...token, 
              plusOneCounters: plusCounters + 1,
              minusOneCounters: minusCounters // Ensure field exists
            };
          }),
        }));
      },

      removeCounter: (id: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const plusCounters = token.plusOneCounters ?? 0;
            const minusCounters = token.minusOneCounters ?? 0;
            
            // If we have +1/+1 counters, remove one of those first
            if (plusCounters > 0) {
              return { 
                ...token, 
                plusOneCounters: plusCounters - 1,
                minusOneCounters: minusCounters // Ensure field exists
              };
            }
            
            // Otherwise, add a -1/-1 counter
            return { 
              ...token, 
              plusOneCounters: plusCounters, // Ensure field exists
              minusOneCounters: minusCounters + 1 
            };
          }),
        }));
      },

      addCustomCounter: (id: string, counterType: string, icon?: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const counters = token.counters || [];
            const existingCounter = counters.find(c => c.type === counterType);
            
            if (existingCounter) {
              return {
                ...token,
                counters: counters.map(c =>
                  c.type === counterType ? { ...c, count: c.count + 1 } : c
                ),
              };
            } else {
              // Get default icon from COUNTER_TYPES or use provided icon
              const defaultCounterType = COUNTER_TYPES.find(ct => ct.type === counterType);
              const counterIcon = icon || defaultCounterType?.icon || '📍';
              
              return {
                ...token,
                counters: [...counters, { type: counterType, count: 1, icon: counterIcon }],
              };
            }
          }),
        }));
      },

      removeCustomCounter: (id: string, counterType: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const counters = token.counters || [];
            const existingCounter = counters.find(c => c.type === counterType);
            
            if (!existingCounter) return token;
            
            if (existingCounter.count <= 1) {
              return {
                ...token,
                counters: counters.filter(c => c.type !== counterType),
              };
            } else {
              return {
                ...token,
                counters: counters.map(c =>
                  c.type === counterType ? { ...c, count: c.count - 1 } : c
                ),
              };
            }
          }),
        }));
      },

      setCounterAmount: (id: string, counterType: string, amount: number) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const counters = token.counters || [];
            
            if (amount <= 0) {
              return {
                ...token,
                counters: counters.filter(c => c.type !== counterType),
              };
            }
            
            const existingCounter = counters.find(c => c.type === counterType);
            
            if (existingCounter) {
              return {
                ...token,
                counters: counters.map(c =>
                  c.type === counterType ? { ...c, count: amount } : c
                ),
              };
            } else {
              // Get default icon from COUNTER_TYPES
              const defaultCounterType = COUNTER_TYPES.find(ct => ct.type === counterType);
              const counterIcon = defaultCounterType?.icon || '📍';
              
              return {
                ...token,
                counters: [...counters, { type: counterType, count: amount, icon: counterIcon }],
              };
            }
          }),
        }));
      },

      updateCounterIcon: (id: string, counterType: string, icon: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id !== id) return token;
            
            const counters = token.counters || [];
            return {
              ...token,
              counters: counters.map(c =>
                c.type === counterType ? { ...c, icon } : c
              ),
            };
          }),
        }));
      },

      clearSummoningSickness: () => {
        set((state) => ({
          tokens: state.tokens.map((token) => ({
            ...token,
            hasSummoningSickness: false,
            isTapped: false, // Also untap all tokens
          })),
        }));
      },

      removeSummoningSickness: (id: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.id === id
              ? { ...token, hasSummoningSickness: false }
              : token
          ),
        }));
      },

      clearAll: () => {
        set({ tokens: [] });
      },

      duplicateToken: (id: string) => {
        const token = get().tokens.find((t) => t.id === id);
        if (token) {
          const newToken: Token = {
            ...token,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          };
          set((state) => ({ tokens: [...state.tokens, newToken] }));
        }
      },

      // Attachment operations
      addAttachment: (tokenId: string, attachment: Attachment) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.id === tokenId
              ? { ...token, attachments: [...token.attachments, attachment] }
              : token
          ),
        }));
      },

      removeAttachment: (tokenId: string, attachmentName: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.id === tokenId
              ? { ...token, attachments: token.attachments.filter(a => a.name !== attachmentName) }
              : token
          ),
        }));
      },

      // Multi-select operations
      toggleSelectToken: (id: string) => {
        set((state) => {
          const newSelected = new Set(state.selectedTokens);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return { selectedTokens: newSelected };
        });
      },

      selectAll: () => {
        set((state) => ({
          selectedTokens: new Set(state.tokens.map(t => t.id)),
        }));
      },

      clearSelection: () => {
        set({ selectedTokens: new Set() });
      },

      transformSelected: (newTemplate: Partial<Token>) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            state.selectedTokens.has(token.id)
              ? { ...token, ...newTemplate }
              : token
          ),
          selectedTokens: new Set(), // Clear selection after transform
        }));
      },

      saveTemplate: (template: TokenTemplate) => {
        set((state) => ({
          customTemplates: [...state.customTemplates, template],
        }));
      },

      removeTemplate: (name: string) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.name !== name),
        }));
      },
    }),
    {
      name: 'token-tracker-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          // Convert selectedTokens array back to Set
          if (state.selectedTokens && Array.isArray(state.selectedTokens)) {
            state.selectedTokens = new Set(state.selectedTokens);
          } else if (!state.selectedTokens) {
            state.selectedTokens = new Set();
          }
          return { state };
        },
        setItem: (name, value) => {
          const { state } = value;
          // Convert selectedTokens Set to array for storage
          const storableState = {
            ...state,
            selectedTokens: state.selectedTokens ? Array.from(state.selectedTokens) : [],
          };
          localStorage.setItem(name, JSON.stringify({ state: storableState }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);