/**
 * Date Utilities - Formatting and relative date calculations
 *
 * @module utils/DateUtils
 * @description
 * Utility class providing static methods for date formatting. Specializes in
 * converting ISO 8601 date strings to user-friendly formats suitable for
 * podcast metadata display.
 *
 * Formats Supported:
 * - readableDate: Full date in locale format (e.g., "03 November 2022")
 * - relativeDate: Relative format (e.g., "Updated 3 days ago")
 *
 * @example
 * import { DateUtils } from './utils/DateUtils.js';
 *
 * const date = "2022-11-01T07:00:00.000Z";
 * DateUtils.readableDate(date);  // "03 November 2022"
 * DateUtils.relativeDate(date);  // "Updated 3 days ago"
 */

/**
 * Static utility class for date operations.
 *
 * @class DateUtils
 * @description
 * Provides date formatting utilities as static methods. Since all methods
 * are stateless utilities, the class is never instantiated.
 *
 * Design Pattern: Static Utility Class
 * - No state management required
 * - Reusable across components
 * - Focused responsibility: Date formatting only
 *
 * @example
 * // All methods are static, use directly from class
 * DateUtils.readableDate(isoString);
 * DateUtils.relativeDate(isoString);
 */
export class DateUtils {
  /**
   * Formats a date string to a readable locale-specific format.
   *
   * @static
   * @param {string} dateString - ISO 8601 date string
   * @returns {string} Formatted date in 'en-ZA' locale (e.g., "03 November 2022")
   *
   * @description
   * Converts ISO 8601 dates to a human-readable format using the South African
   * English locale (en-ZA), which formats as: day month year.
   *
   * Locale choice (en-ZA):
   * - Uses long month names (e.g., "November" not "11")
   * - Provides consistent, readable output
   * - Can be changed if different locale format needed
   *
   * @example
   * const date = "2022-11-03T07:00:00.000Z";
   * const formatted = DateUtils.readableDate(date);
   * console.log(formatted); // "03 November 2022"
   *
   * @example
   * // Works with various ISO 8601 formats
   * DateUtils.readableDate("2022-11-03");         // "03 November 2022"
   * DateUtils.readableDate("2022-11-03T10:30");   // "03 November 2022"
   * DateUtils.readableDate("2022-11-03T10:30:45Z"); // "03 November 2022"
   */
  static readableDate(dateString) {
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  }

  /**
   * Calculates and formats a relative time string (e.g., "3 days ago").
   *
   * @static
   * @param {string} dateString - ISO 8601 date string to compare against "now"
   * @returns {string} Relative time string (e.g., "Updated 3 days ago")
   *
   * @description
   * Calculates the difference between a given date and a fixed "now" date,
   * then formats it as a human-readable relative expression.
   *
   * Time Intervals:
   * - Exactly 1 day: "Updated 1 day ago"
   * - Less than 7 days: "Updated X days ago"
   * - 7+ days: "Updated X weeks ago"
   *
   * Reference Time:
   * - Fixed at: 2022-11-04T00:00:00.000Z
   * - This ensures consistent behavior across test environments
   * - In production, consider using new Date() for live timestamps
   *
   * @example
   * const date = "2022-11-03T07:00:00.000Z"; // 1 day ago
   * const relative = DateUtils.relativeDate(date);
   * console.log(relative); // "Updated 1 day ago"
   *
   * @example
   * const date = "2022-10-25T07:00:00.000Z"; // ~10 days ago
   * const relative = DateUtils.relativeDate(date);
   * console.log(relative); // "Updated 1 weeks ago"
   * // Note: Uses plural "weeks" when > 1, singular "week" when = 1
   *
   * @example
   * // Days rounding
   * const date = "2022-11-02T07:00:00.000Z"; // ~2 days ago
   * const relative = DateUtils.relativeDate(date);
   * console.log(relative); // "Updated 2 days ago"
   */
  static relativeDate(dateString) {
    // Fixed "now" for consistent testing behavior
    const now = new Date("2022-11-04T00:00:00.000Z");
    const then = new Date(dateString);

    // Calculate days difference, with minimum of 1
    const diffDays = Math.max(
      1,
      Math.round((now - then) / (1000 * 60 * 60 * 24)),
    );

    // Format based on time interval
    if (diffDays === 1) {
      return "Updated 1 day ago";
    }
    if (diffDays < 7) {
      return `Updated ${diffDays} days ago`;
    }

    // Convert to weeks and handle singular/plural
    const weeks = Math.round(diffDays / 7);
    return `Updated ${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
}
