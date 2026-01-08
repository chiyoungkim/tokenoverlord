import type { Color } from '../types/token';

export const getColorGradient = (colors: Color[]): string => {
  if (colors.length === 0) return 'bg-gray-200';
  
  const colorMap: Record<Color, string> = {
    W: '#F0F0D8', // White/Plains - Light
    U: '#0E68AB', // Blue/Island - Dark
    B: '#150B00', // Black/Swamp - Dark
    R: '#D3202A', // Red/Mountain - Dark
    G: '#00733E', // Green/Forest - Dark
    C: '#CAC5C0', // Colorless - Light
  };

  if (colors.length === 1) {
    return colorMap[colors[0]];
  }

  // Multi-color gradient
  const colorStops = colors.map((c) => colorMap[c]).join(', ');
  return `linear-gradient(135deg, ${colorStops})`;
};

export const getColorBorder = (colors: Color[]): string => {
  if (colors.length === 0) return 'border-gray-400';
  
  const colorMap: Record<Color, string> = {
    W: 'border-yellow-200',
    U: 'border-blue-600',
    B: 'border-gray-900',
    R: 'border-red-700',
    G: 'border-green-700',
    C: 'border-gray-500',
  };

  return colorMap[colors[0]];
};

export const isLightColor = (colors: Color[]): boolean => {
  // Returns true if we should use dark text on this background
  if (colors.length === 0) return true; // Colorless is light
  
  const lightColors: Color[] = ['W', 'C']; // White and Colorless
  return lightColors.includes(colors[0]);
};
