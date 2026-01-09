export type Color = 'W' | 'U' | 'B' | 'R' | 'G' | 'C'; // White, Blue, Black, Red, Green, Colorless

// Common counter types
export const COUNTER_TYPES = [
  { type: '+1/+1', icon: '⬆', color: 'green' },
  { type: '-1/-1', icon: '⬇', color: 'red' },
  { type: 'loyalty', icon: '⚡', color: 'purple' },
  { type: 'charge', icon: '🔋', color: 'blue' },
  { type: 'energy', icon: 'Ⓔ', color: 'yellow' },
  { type: 'poison', icon: '☠', color: 'purple' },
  { type: 'treasure', icon: '💰', color: 'amber' },
  { type: 'food', icon: '🍖', color: 'green' },
] as const;

export interface Attachment {
  name: string;
  effect: string; // e.g., "+2/+2", "Flying", "First Strike"
}

export interface Counter {
  type: string; // e.g., "+1/+1", "-1/-1", "loyalty", "charge", "energy"
  count: number;
  icon?: string; // Customizable emoji/icon for display
}

export interface Token {
  id: string;
  name: string;
  power: number | null;
  toughness: number | null;
  colors: Color[];
  abilities?: string;
  imageUrl?: string;
  isTapped: boolean;
  hasSummoningSickness: boolean;
  hasHaste: boolean; // Tokens with haste don't have summoning sickness
  plusOneCounters: number; // Legacy - keep for backward compatibility
  minusOneCounters: number; // Legacy - keep for backward compatibility
  counters: Counter[]; // New flexible counter system
  attachments: Attachment[]; // Auras, Equipment, etc.
  createdAt: number;
}

export interface TokenTemplate {
  name: string;
  power: number | null;
  toughness: number | null;
  colors: Color[];
  abilities?: string;
  imageUrl?: string;
  hasHaste?: boolean;
}

// Predefined common tokens
export const COMMON_TOKENS: TokenTemplate[] = [
  {
    name: '1/1 Soldier',
    power: 1,
    toughness: 1,
    colors: ['W'],
    imageUrl: undefined,
  },
  {
    name: '1/1 Goblin',
    power: 1,
    toughness: 1,
    colors: ['R'],
    imageUrl: undefined,
  },
  {
    name: '2/2 Zombie',
    power: 2,
    toughness: 2,
    colors: ['B'],
    imageUrl: undefined,
  },
  {
    name: '3/3 Beast',
    power: 3,
    toughness: 3,
    colors: ['G'],
    imageUrl: undefined,
  },
  {
    name: '1/1 Saproling',
    power: 1,
    toughness: 1,
    colors: ['G'],
    imageUrl: undefined,
  },
  {
    name: 'Treasure',
    power: null,
    toughness: null,
    colors: [],
    imageUrl: undefined,
  },
  {
    name: 'Food',
    power: null,
    toughness: null,
    colors: [],
    imageUrl: undefined,
  },
];