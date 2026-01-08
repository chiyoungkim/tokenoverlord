import type { Token } from '../types/token';

export interface TokenGroup {
  key: string; // Unique identifier for this group
  tokens: Token[];
  count: number;
  isExpanded: boolean;
  representative: Token; // The token to display for the group
}

/**
 * Generates a unique key for a token based on its groupable properties
 */
export const getTokenGroupKey = (token: Token): string => {
  const parts = [
    token.name,
    `${token.power}/${token.toughness}`,
    token.colors.sort().join(','),
    token.abilities || '',
    token.isTapped ? 'tapped' : 'untapped',
    token.hasSummoningSickness ? 'sick' : 'ready',
    `plus:${token.plusOneCounters ?? 0}`,
    `minus:${token.minusOneCounters ?? 0}`,
    // Attachments also affect grouping
    token.attachments?.map(a => `${a.name}:${a.effect}`).sort().join('|') || ''
  ];
  
  return parts.join('::');
};

/**
 * Groups tokens by their properties
 */
export const groupTokens = (tokens: Token[], minStackSize: number = 2): TokenGroup[] => {
  const groups = new Map<string, Token[]>();
  
  // Group tokens by their key
  tokens.forEach(token => {
    const key = getTokenGroupKey(token);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(token);
  });
  
  // Convert to TokenGroup array
  const tokenGroups: TokenGroup[] = [];
  
  groups.forEach((groupTokens, key) => {
    if (groupTokens.length >= minStackSize) {
      // Stack these tokens
      tokenGroups.push({
        key,
        tokens: groupTokens,
        count: groupTokens.length,
        isExpanded: false,
        representative: groupTokens[0], // Use first token as representative
      });
    } else {
      // Keep as individual tokens (each in own group)
      groupTokens.forEach(token => {
        tokenGroups.push({
          key: `${key}::${token.id}`, // Unique key for individual
          tokens: [token],
          count: 1,
          isExpanded: false,
          representative: token,
        });
      });
    }
  });
  
  return tokenGroups;
};