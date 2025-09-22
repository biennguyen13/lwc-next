/**
 * Simple tooltip state management
 * Just add a boolean to window object for easy devtools control
 */

// Declare global window interface
declare global {
  interface Window {
    showTooltips?: boolean;
    setShowTooltips?: (show: boolean) => void;
  }
}

/**
 * Initialize tooltip state
 * Call this once when app starts
 */
export const initTooltipState = (onChange?: (show: boolean) => void) => {
  if (typeof window !== 'undefined') {
    // Default to false, can be changed in devtools
    window.showTooltips = !!window.showTooltips;
    
    // Create setter function
    window.setShowTooltips = (show: boolean) => {
      window.showTooltips = show;
      console.log('🎯 Tooltip state changed:', show);
      // Call onChange callback if provided
      if (onChange) {
        onChange(show);
      }
    };
    
    console.log('🎯 Tooltip state initialized. Use window.setShowTooltips(true/false) to control');
  }
};

/**
 * Get current tooltip state
 */
export const getTooltipState = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.showTooltips ?? false;
};
