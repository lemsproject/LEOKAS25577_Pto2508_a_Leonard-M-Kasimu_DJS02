import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";
import { seasons, genres } from "../data.js";

/**
 * Modal Controller Module - Manages podcast details modal display
 *
 * @module components/createModal
 * @description
 * Implements the Module Pattern (IIFE) to create a singleton modal controller.
 * Encapsulates all modal-related state and behavior, providing only the
 * necessary public methods (open, close).
 *
 * Follows these design principles:
 * - **SRP** (Single Responsibility): Handles only modal logic
 * - **OCP** (Open/Closed): Can extend with new fields without modifying usage
 * - **Encapsulation**: Private functions and state not exposed
 *
 * @example
 * import { createModal } from './components/createModal.js';
 *
 * // Open modal with podcast data
 * createModal.open(podcastData);
 *
 * // Close modal
 * createModal.close();
 *
 * // Listen to click events
 * // Modal automatically closes on background click or close button
 */

/**
 * Modal Controller - Implements Module Pattern for modal management
 *
 * @typedef {Object} ModalController
 * @property {Function} open - Opens modal with podcast details
 * @property {Function} close - Closes the modal
 */

/**
 * IIFE (Immediately Invoked Function Expression) that creates the modal
 * controller with private state and public methods.
 *
 * @type {ModalController}
 * @constant
 * @private
 */
export const createModal = (() => {
  // Private helper function to safely get DOM elements
  /**
   * Safely retrieves a DOM element by ID.
   *
   * @function el
   * @param {string} id - The element's ID attribute
   * @returns {HTMLElement|null} The element or null if not found
   * @private
   */
  const el = (id) => document.getElementById(id);

  // Cache references to frequently accessed DOM elements
  const modal = el("modal");
  const genreService = new GenreService(genres);

  /**
   * Updates modal content with podcast details.
   *
   * @function updateContent
   * @param {Object} podcast - Podcast data object
   * @param {string} podcast.id - Unique podcast ID
   * @param {string} podcast.title - Podcast title
   * @param {string} podcast.image - Cover image URL
   * @param {string} podcast.description - Full podcast description
   * @param {number[]} podcast.genres - Array of genre IDs
   * @param {string} podcast.updated - ISO 8601 date string
   *
   * @returns {void}
   *
   * @description
   * Populates all modal elements with podcast data:
   * 1. Sets cover image and title
   * 2. Resolves genre IDs to names
   * 3. Formats and displays update date
   * 4. Fetches and renders season information
   *
   * @private
   */
  function updateContent(podcast) {
    // Set podcast metadata
    el("modalImage").src = podcast.image;
    el("modalTitle").textContent = podcast.title;
    el("modalDesc").textContent = podcast.description;

    // Render genres as styled tags
    el("modalGenres").innerHTML = genreService
      .getTitles(podcast.genres)
      .map((g) => `<span class="tag">${g}</span>`)
      .join("");

    // Format and display relative date
    el("modalUpdated").textContent = DateUtils.relativeDate(podcast.updated);

    // Fetch season data and render season list
    const seasonData =
      seasons.find((s) => s.id === podcast.id)?.seasonDetails || [];

    el("seasonList").innerHTML = seasonData
      .map(
        (s, index) => `
          <li class="season-item">
            <strong class="season-title">Season ${index + 1}: ${
              s.title
            }</strong>
            <span class="episodes">${s.episodes} episodes</span>
          </li>`,
      )
      .join("");
  }

  // Public API - Return object with only necessary methods
  return {
    /**
     * Opens the modal and populates it with podcast details.
     *
     * @function open
     * @param {Object} podcast - Podcast data to display
     * @returns {void}
     *
     * @example
     * createModal.open(selectedPodcast);
     * // Modal appears with podcast details
     */
    open(podcast) {
      updateContent(podcast);
      modal.classList.remove("hidden");
    },

    /**
     * Closes the modal by hiding it.
     *
     * @function close
     * @returns {void}
     *
     * @example
     * createModal.close();
     * // Modal disappears
     */
    close() {
      modal.classList.add("hidden");
    },
  };
})();

// ============================================================================
// Event Listeners - Set up modal interaction handlers
// ============================================================================

/**
 * Close button click handler
 *
 * @description
 * Closes modal when close button is clicked
 */
const closeButton = document.getElementById("closeModal");
if (closeButton) {
  closeButton.addEventListener("click", () => createModal.close());

  /**
   * Backdrop click handler
   *
   * @description
   * Closes modal when user clicks outside the modal content area
   * (on the dark backdrop). Uses event delegation to check if the
   * click target is the backdrop itself, not the modal content.
   */
  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target.id === "modal") {
      createModal.close();
    }
  });
}
