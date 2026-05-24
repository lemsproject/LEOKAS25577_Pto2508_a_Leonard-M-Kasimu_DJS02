/**
 * Genre Service - Utility for resolving genre names
 *
 * @module utils/GenreService
 * @description
 * Service class that provides methods for converting genre IDs to human-readable
 * names. Implements a simple repository pattern for genre data access.
 *
 * Design Pattern: Service/Repository
 * - Single responsibility: Genre name resolution
 * - Dependency injection: Genres array passed to constructor
 * - Reusable across components: Used by PodcastCard, createGrid, createModal
 *
 * @example
 * import { GenreService } from './utils/GenreService.js';
 *
 * const genreService = new GenreService(genres);
 * const name = genreService.getTitle(1);        // "Crime"
 * const names = genreService.getTitles([1, 2]); // ["Crime", "Comedy"]
 */

/**
 * Service class for managing genre data.
 *
 * @class GenreService
 * @description
 * Provides methods to retrieve genre names by their IDs. Encapsulates
 * the genres array and provides a clean public interface.
 *
 * Internal Structure:
 * - Genres array: [{id: 1, title: "Crime"}, {id: 2, title: "Comedy"}, ...]
 * - Search: Linear lookup via Array.find()
 * - Performance: O(n) per lookup; acceptable for small dataset (<100 genres)
 *
 * @example
 * const service = new GenreService(genresArray);
 */
export class GenreService {
  /**
   * Initializes the service with genres data.
   *
   * @constructor
   * @param {Array<Object>} genres - Array of genre objects
   * @param {number} genres[].id - Unique genre identifier
   * @param {string} genres[].title - Human-readable genre name
   *
   * @example
   * const genres = [
   *   { id: 1, title: "Crime" },
   *   { id: 2, title: "Comedy" }
   * ];
   * const service = new GenreService(genres);
   */
  constructor(genres) {
    this.genres = genres;
  }

  /**
   * Retrieves the title for a single genre ID.
   *
   * @param {number} id - The genre ID to look up
   * @returns {string} The genre title, or "Unknown" if not found
   *
   * @description
   * Looks up a genre by ID and returns its title. If the ID is not found,
   * returns "Unknown" as a fallback to prevent rendering blank text.
   *
   * Performance: O(n) where n = number of genres (typically < 50)
   *
   * @example
   * const title = genreService.getTitle(1);
   * console.log(title); // "Crime"
   *
   * @example
   * // Graceful fallback for invalid ID
   * const title = genreService.getTitle(999);
   * console.log(title); // "Unknown"
   */
  getTitle(id) {
    return this.genres.find((genre) => genre.id === id)?.title ?? "Unknown";
  }

  /**
   * Retrieves titles for multiple genre IDs.
   *
   * @param {number[]} ids - Array of genre IDs
   * @returns {string[]} Array of genre titles (preserves input order)
   *
   * @description
   * Converts an array of genre IDs to an array of genre titles.
   * Order is preserved: results[i] corresponds to ids[i].
   *
   * Performance: O(n*m) where n = number of IDs, m = number of genres
   * For typical use cases (2-4 genres, <50 total genres): negligible
   *
   * @example
   * const titles = genreService.getTitles([1, 3, 2]);
   * console.log(titles); // ["Crime", "True Crime", "Comedy"]
   *
   * @example
   * // Works with empty array
   * const titles = genreService.getTitles([]);
   * console.log(titles); // []
   *
   * @example
   * // Handles invalid IDs gracefully
   * const titles = genreService.getTitles([1, 999, 2]);
   * console.log(titles); // ["Crime", "Unknown", "Comedy"]
   */
  getTitles(ids) {
    return ids.map((id) => this.getTitle(id));
  }
}
