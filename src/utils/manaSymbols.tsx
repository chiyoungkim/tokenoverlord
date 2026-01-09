import React from 'react';

/**
 * Parses MTG ability text and replaces symbol codes with Mana font icons
 * Uses the Mana font from https://mana.andrewgioia.com/
 */

export const parseManaSymbols = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Match {X} patterns
  const symbolRegex = /\{([^}]+)\}/g;
  let match;
  
  while ((match = symbolRegex.exec(text)) !== null) {
    // Add text before the symbol
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add the mana symbol
    const symbol = match[1].toLowerCase();
    const manaClass = getManaClass(symbol);
    
    parts.push(
      <i 
        key={`symbol-${match.index}`}
        className={`ms ms-${manaClass} ms-cost`}
        style={{ fontSize: '1.2em' }}
      />
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }
  
  return parts;
};

/**
 * Maps MTG symbol codes to Mana font classes
 */
const getManaClass = (symbol: string): string => {
  // Special mappings
  const mappings: Record<string, string> = {
    // Tap/Untap
    't': 'tap',
    'q': 'untap',
    
    // Basic mana
    'w': 'w',
    'u': 'u',
    'b': 'b',
    'r': 'r',
    'g': 'g',
    'c': 'c', // Colorless
    
    // Numbers
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '10': '10', '11': '11', '12': '12', '13': '13', '14': '14',
    '15': '15', '16': '16', '17': '17', '18': '18', '19': '19', '20': '20',
    
    // Variables
    'x': 'x',
    'y': 'y',
    'z': 'z',
    
    // Hybrid mana (common combinations)
    'w/u': 'wu',
    'w/b': 'wb',
    'u/b': 'ub',
    'u/r': 'ur',
    'b/r': 'br',
    'b/g': 'bg',
    'r/w': 'rw',
    'r/g': 'rg',
    'g/w': 'gw',
    'g/u': 'gu',
    
    // Phyrexian mana
    'w/p': 'wp',
    'u/p': 'up',
    'b/p': 'bp',
    'r/p': 'rp',
    'g/p': 'gp',
    
    // Snow
    's': 's',
    
    // Energy
    'e': 'e',
  };
  
  return mappings[symbol] || symbol;
};