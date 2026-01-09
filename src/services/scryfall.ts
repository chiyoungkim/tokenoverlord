/**
 * Scryfall API Service
 * https://scryfall.com/docs/api
 */

export interface ScryfallCard {
  id: string;
  name: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors: string[];
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    image_uris?: {
      art_crop: string;
      normal: string;
    };
    oracle_text?: string;
    power?: string;
    toughness?: string;
  }>;
}

const SCRYFALL_API = 'https://api.scryfall.com';

/**
 * Fetch card data by exact name
 */
export async function fetchCardByName(name: string): Promise<ScryfallCard | null> {
  try {
    const response = await fetch(`${SCRYFALL_API}/cards/named?exact=${encodeURIComponent(name)}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Scryfall API error:', error);
    return null;
  }
}

/**
 * Fetch card data by fuzzy name match
 */
export async function fetchCardByFuzzyName(name: string): Promise<ScryfallCard | null> {
  try {
    const response = await fetch(`${SCRYFALL_API}/cards/named?fuzzy=${encodeURIComponent(name)}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Scryfall API error:', error);
    return null;
  }
}

/**
 * Search for cards by name
 */
export async function searchCards(query: string, includeTokens = true): Promise<ScryfallCard[]> {
  try {
    const typeFilter = includeTokens ? '+type:token' : '';
    const response = await fetch(
      `${SCRYFALL_API}/cards/search?q=${encodeURIComponent(query)}${typeFilter}&unique=cards`
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Scryfall search error:', error);
    return [];
  }
}

/**
 * Get autocomplete suggestions
 */
export async function getAutocomplete(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${SCRYFALL_API}/cards/autocomplete?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Scryfall autocomplete error:', error);
    return [];
  }
}

/**
 * Extract art URL from Scryfall card data
 */
export function getCardArtUrl(card: ScryfallCard): string | null {
  // Prefer art_crop for token cards
  if (card.image_uris?.art_crop) {
    return card.image_uris.art_crop;
  }
  
  // Check card faces for double-faced cards
  if (card.card_faces?.[0]?.image_uris?.art_crop) {
    return card.card_faces[0].image_uris.art_crop;
  }
  
  return null;
}

/**
 * Extract oracle text from Scryfall card
 */
export function getCardOracleText(card: ScryfallCard): string | null {
  if (card.oracle_text) {
    return card.oracle_text;
  }
  
  // Check card faces for double-faced cards
  if (card.card_faces?.[0]?.oracle_text) {
    return card.card_faces[0].oracle_text;
  }
  
  return null;
}

/**
 * Map Scryfall colors to our token colors
 */
export function mapScryfallColors(colors: string[]): ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[] {
  if (colors.length === 0) {
    return ['C']; // Colorless
  }
  
  return colors.map(color => {
    switch (color) {
      case 'W': return 'W';
      case 'U': return 'U';
      case 'B': return 'B';
      case 'R': return 'R';
      case 'G': return 'G';
      default: return 'C';
    }
  }) as ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[];
}

/**
 * Fetch token-specific card data with fallback to any card
 */
export async function fetchTokenData(name: string): Promise<ScryfallCard | null> {
  console.log(`🔍 Searching Scryfall for: "${name}"`);
  
  // Strip P/T from name if present (e.g., "1/1 Soldier" -> "Soldier")
  const cleanName = name.replace(/^\d+\/\d+\s+/, '');
  console.log(`   Clean name: "${cleanName}"`);
  
  // First try searching specifically for tokens with clean name
  try {
    const tokenQuery = `${cleanName} t:token`;
    console.log(`   Query 1: ${tokenQuery}`);
    const response = await fetch(
      `${SCRYFALL_API}/cards/search?q=${encodeURIComponent(tokenQuery)}&unique=cards&order=released&dir=desc`
    );
    
    console.log(`   Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        console.log(`   ✅ Found token card:`, data.data[0].name);
        return data.data[0];
      }
    }
  } catch (error) {
    console.error(`   ❌ Token search error:`, error);
  }
  
  // Fallback to fuzzy name match with clean name
  console.log(`   Fallback: Fuzzy search for "${cleanName}"`);
  return fetchCardByFuzzyName(cleanName);
}