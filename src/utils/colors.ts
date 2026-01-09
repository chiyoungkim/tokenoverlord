import type { Color } from '../types/token';

export const getColorGradient = (colors: Color[]): string => {
  if (colors.length === 0) {
    // Colorless - Metallic gray gradient (was transparent/light gray)
    return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
  }
  
  const colorMap: Record<Color, string> = {
    W: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)', // Clean white
    U: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)', // Ocean blue
    B: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)', // Deep black/gray
    R: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)', // Fire red
    G: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', // Forest green
    C: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', // Metallic colorless
  };

  if (colors.length === 1) {
    return colorMap[colors[0]];
  }

  // Multi-color - blend colors smoothly
  const colorStops = colors.map((c) => {
    const baseColor = colorMap[c];
    // Extract the first color from gradient
    const match = baseColor.match(/#[0-9a-f]{6}/i);
    return match ? match[0] : '#9ca3af';
  }).join(', ');
  
  return `linear-gradient(135deg, ${colorStops})`;
};

export const getColorBorder = (colors: Color[]): string => {
  if (colors.length === 0) return 'border-gray-500';
  
  const colorMap: Record<Color, string> = {
    W: 'border-gray-300',
    U: 'border-blue-500',
    B: 'border-gray-700',
    R: 'border-red-600',
    G: 'border-green-600',
    C: 'border-gray-500',
  };

  return colorMap[colors[0]];
};

export const isLightColor = (colors: Color[]): boolean => {
  // Returns true if we should use dark text on this background
  if (colors.length === 0) return false; // Colorless is now darker gray
  
  const lightColors: Color[] = ['W']; // Only white needs dark text
  return lightColors.includes(colors[0]);
};