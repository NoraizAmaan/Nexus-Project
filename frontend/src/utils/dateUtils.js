/**
 * Calculates a granular string representing the time remaining until a target date.
 * @param {string|Date} date - The target expiration date.
 * @returns {string} - A human-readable string (e.g., "In 2 weeks 3 days").
 */
export function calcAccess(date) {
    if (!date) return "N/A";

    const targetDate = new Date(date);
    const now = new Date();

    // Reset time to midnight for accurate day difference
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffInMs = targetDate - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return "Expired";
    if (diffInDays === 0) return "Expires Today";

    let days = diffInDays;
    const years = Math.floor(days / 365);
    days %= 365;
    const months = Math.floor(days / 30);
    days %= 30;
    const weeks = Math.floor(days / 7);
    days %= 7;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    // If we have many parts, only show the top 2 for clarity (optional, but usually nicer UI)
    const result = parts.slice(0, 2).join(" ");
    return `In ${result}`;
}
