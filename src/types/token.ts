export type Color = 'W' | 'U' | 'B' | 'R' | 'G' | 'C'; // White, Blue, Black, Red, Green, Colorless

export interface Attachment {
  name: string;
  effect: string; // e.g., "+2/+2", "Flying", "First Strike"
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
  plusOneCounters: number;
  minusOneCounters: number; // Track -1/-1 counters separately
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
    abilities: '{T}, Sacrifice this artifact: Add one mana of any color.',
    imageUrl: undefined,
  },
  {
    name: 'Food',
    power: null,
    toughness: null,
    colors: [],
    abilities: '{2}, {T}, Sacrifice this artifact: You gain 3 life.',
    imageUrl: undefined,
  },
];
