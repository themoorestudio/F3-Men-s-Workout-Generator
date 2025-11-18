/**
 * Parses a time duration from a string and returns it in seconds.
 * Handles formats like "60 seconds", "45s", "1 minute", "2 min".
 * @param text The string to parse.
 * @returns The duration in seconds, or null if no time is found.
 */
export const parseTime = (text: string): number | null => {
  // Check for minutes first to avoid conflict with 's' in 'minutes'
  const minutesMatch = text.match(/(\d+)\s*(minutes|minute|min)\b/i);
  if (minutesMatch) {
    return parseInt(minutesMatch[1], 10) * 60;
  }

  // Check for seconds
  const secondsMatch = text.match(/(\d+)\s*(seconds|second|sec|s)\b/i);
  if (secondsMatch) {
    return parseInt(secondsMatch[1], 10);
  }

  return null;
};
