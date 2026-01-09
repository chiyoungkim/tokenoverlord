import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomCounterType {
  type: string;
  icon: string;
  color: string;
}

interface CounterTypesStore {
  customCounterTypes: CustomCounterType[];
  addCounterType: (type: string, icon: string, color?: string) => void;
  removeCounterType: (type: string) => void;
  updateCounterType: (type: string, icon: string, color?: string) => void;
}

export const useCounterTypesStore = create<CounterTypesStore>()(
  persist(
    (set) => ({
      customCounterTypes: [],

      addCounterType: (type: string, icon: string, color: string = 'gray') => {
        set((state) => {
          // Check if already exists
          if (state.customCounterTypes.find(ct => ct.type === type)) {
            return state;
          }
          return {
            customCounterTypes: [...state.customCounterTypes, { type, icon, color }],
          };
        });
      },

      removeCounterType: (type: string) => {
        set((state) => ({
          customCounterTypes: state.customCounterTypes.filter(ct => ct.type !== type),
        }));
      },

      updateCounterType: (type: string, icon: string, color: string = 'gray') => {
        set((state) => ({
          customCounterTypes: state.customCounterTypes.map(ct =>
            ct.type === type ? { ...ct, icon, color } : ct
          ),
        }));
      },
    }),
    {
      name: 'counter-types-storage',
    }
  )
);