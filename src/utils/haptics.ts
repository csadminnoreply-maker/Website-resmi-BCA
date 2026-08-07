export const triggerHaptic = (duration: number = 12) => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore error if haptics blocked by permission or browser
    }
  }
};
