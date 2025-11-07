/**
 * Format date in UTC-8 (Pacific Time)
 * @param date Optional date, defaults to now
 * @returns Formatted date string in Pacific Time
 */
export function formatPacificTime(date?: Date): string {
  const d = date || new Date();
  
  // Convert to Pacific Time (UTC-8)
  // Using Intl.DateTimeFormat for proper timezone handling
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', // Pacific Time (handles DST automatically)
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  return formatter.format(d);
}

/**
 * Format date for display in emails and PDFs
 * @param date Optional date, defaults to now
 * @returns Formatted date string like "11/07/2025, 02:30:45 PM"
 */
export function formatDateForDisplay(date?: Date): string {
  return formatPacificTime(date);
}

