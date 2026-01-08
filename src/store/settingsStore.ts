import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CardSize = 'small' | 'medium' | 'large';

interface SettingsStore {
  autoStackEnabled: boolean;
  minStackSize: number;
  cardSize: CardSize;
  
  setAutoStackEnabled: (enabled: boolean) => void;
  setMinStackSize: (size: number) => void;
  setCardSize: (size: CardSize) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      autoStackEnabled: true,
      minStackSize: 2, // Stack when you have 2+ identical tokens
      cardSize: 'large', // Default to large (current size)
      
      setAutoStackEnabled: (enabled: boolean) => {
        set({ autoStackEnabled: enabled });
      },
      
      setMinStackSize: (size: number) => {
        // Clamp between 2 and 10
        const clampedSize = Math.max(2, Math.min(10, size));
        set({ minStackSize: clampedSize });
      },
      
      setCardSize: (size: CardSize) => {
        set({ cardSize: size });
      },
    }),
    {
      name: 'token-tracker-settings',
    }
  )
);