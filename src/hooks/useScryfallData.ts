import { useEffect, useState } from 'react';
import { fetchTokenData, getCardArtUrl, getCardOracleText } from '../services/scryfall';
import { COMMON_TOKENS } from '../types/token';

/**
 * Cache for Scryfall data to avoid repeated API calls
 */
const scryfallCache: Record<string, { imageUrl: string | null; oracleText: string | null }> = {};

/**
 * Hook to fetch and cache Scryfall data for common tokens
 */
export function useScryfallData() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Fetch Scryfall data for all common tokens on mount
    const fetchCommonTokenData = async () => {
      console.log('🔮 Starting Scryfall data fetch for common tokens...');
      setIsLoading(true);
      
      for (const token of COMMON_TOKENS) {
        // Skip if already cached
        if (scryfallCache[token.name]) {
          console.log(`⚡ Cache hit for ${token.name}`);
          continue;
        }

        console.log(`🔍 Fetching data for: ${token.name}`);
        
        try {
          const cardData = await fetchTokenData(token.name);
          if (cardData) {
            const imageUrl = getCardArtUrl(cardData);
            const oracleText = getCardOracleText(cardData);
            
            scryfallCache[token.name] = {
              imageUrl,
              oracleText,
            };
            
            console.log(`✅ Fetched Scryfall data for ${token.name}:`, {
              hasImage: !!imageUrl,
              imageUrl: imageUrl,
              hasOracle: !!oracleText,
              oracleText: oracleText?.substring(0, 50) + '...',
            });
          } else {
            console.log(`⚠️ No Scryfall data found for ${token.name}`);
            scryfallCache[token.name] = { imageUrl: null, oracleText: null };
          }
        } catch (error) {
          console.error(`❌ Error fetching Scryfall data for ${token.name}:`, error);
          scryfallCache[token.name] = { imageUrl: null, oracleText: null };
        }
        
        // Rate limiting: Wait 100ms between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('✅ Scryfall data fetch complete!');
      console.log('📦 Final cache:', scryfallCache);
      setIsLoading(false);
      setIsReady(true);
    };

    fetchCommonTokenData();
  }, []);

  return { scryfallCache, isLoading, isReady };
}

/**
 * Get Scryfall data for a specific token name
 */
export function getScryfallData(tokenName: string) {
  return scryfallCache[tokenName] || { imageUrl: null, oracleText: null };
}

/**
 * Fetch Scryfall data for a custom token name
 */
export async function fetchCustomTokenData(tokenName: string) {
  // Check cache first
  if (scryfallCache[tokenName]) {
    return scryfallCache[tokenName];
  }

  try {
    const cardData = await fetchTokenData(tokenName);
    if (cardData) {
      const imageUrl = getCardArtUrl(cardData);
      const oracleText = getCardOracleText(cardData);
      
      scryfallCache[tokenName] = {
        imageUrl,
        oracleText,
      };
      
      return scryfallCache[tokenName];
    }
  } catch (error) {
    console.error(`Error fetching Scryfall data for ${tokenName}:`, error);
  }

  scryfallCache[tokenName] = { imageUrl: null, oracleText: null };
  return scryfallCache[tokenName];
}