// Calm, grounding color palette
export const colors = {
  // Primary colors
  primary: '#5B7C99',           // Muted blue for work/morning
  secondary: '#E8956B',         // Warm orange for evening
  
  // Backgrounds
  background: '#F5F5F5',        // Off-white
  surface: '#FFFFFF',           // Pure white for cards
  surfaceVariant: '#F9FAFB',    // Slightly darker white
  
  // Text colors
  text: '#2C3E50',              // Dark blue-gray
  textSecondary: '#7F8C8D',     // Medium gray
  textLight: '#BDC3C7',         // Light gray
  
  // Status colors
  success: '#52B788',           // Calm green
  warning: '#F4A261',           // Warm orange
  error: '#E76F51',             // Soft red
  info: '#5B7C99',              // Primary blue
  
  // Category colors (for routines)
  morning: '#87CEEB',           // Sky blue
  work: '#5B7C99',              // Muted blue
  exercise: '#52B788',          // Green
  household: '#E8956B',         // Orange
  evening: '#9B59B6',           // Purple
  
  // UI elements
  border: '#E0E4E8',            // Light gray border
  divider: '#ECF0F1',           // Very light gray
  overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  
  // Special
  confetti: ['#52B788', '#5B7C99', '#E8956B', '#9B59B6', '#F4A261'],
};

// Opacity helpers
export const withOpacity = (color, opacity) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};
