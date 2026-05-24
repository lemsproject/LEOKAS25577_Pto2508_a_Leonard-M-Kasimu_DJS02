/**
 * PodcastApp - Main application controller
 *
 * @module index
 * @description
 * Entry point for the podcast application. Orchestrates filtering, sorting,
 * and rendering of podcast content using the Web Component architecture.
 *
 * Architecture:
 * - OOP pattern with a single PodcastApp class
 * - Dependency injection for GenreService
 * - Event delegation for filter/sort controls
 * - Composition with functional modules (createGrid, createModal)
 *
 * @example
 * // Application is auto-initialized on page load
 * // via: new PodcastApp().init()
 */

import { podcasts, genres, seasons } from "./data.js";
import { GenreService } from "./utils/GenreService.js";
import { createGrid } from "./views/createGrid.js";
import { createModal } from "./components/createModal.js";
import { createSearchModal } from "./components/createSearchModal.js";

/**
 * Main application controller for the Podcast App.
 *
 * @class PodcastApp
 * @description
 * Manages application state, filtering, sorting, and rendering.
 * Implements the MVC-like pattern where this class acts as the
 * controller, orchestrating view (components) and model (data) interactions.
 *
 * State Management:
 * - selectedGenre: Current filter selection
 * - selectedSort: Current sort criteria
 * - Cache DOM elements for performance
 *
 * Event Flow:
 * User selects filter/sort → Event listener → Re-render → createGrid →
 * PodcastCard components → User clicks card → Modal opens
 *
 * @example
 * const app = new PodcastApp();
 * app.init();
 */
class PodcastApp {
  /**
   * Initializes the PodcastApp with services and DOM elements.
   *
   * @constructor
   * @description
   * Sets up the application by caching DOM elements, creating services,
   * and initializing default state.
   *
   * State initialized:
   * - selectedGenre: "all" (show all podcasts)
   * - selectedSort: "recent" (most recent first)
   */
  constructor() {
    // Create genre service instance for name resolution
    this.genreService = new GenreService(genres);

    // Cache DOM elements for performance (avoid repeated queries)
    this.grid = document.querySelector("#podcast-grid");
    this.genreFilter = document.querySelector("#genre-filter");
    this.sortFilter = document.querySelector("#sort-filter");
    this.modalRoot = document.querySelector("#modal-root");
    this.searchButton = document.querySelector(
      '[aria-label="Search podcasts"]',
    );

    // Initialize application state
    this.selectedGenre = "all";
    this.selectedSort = "recent";
  }

  /**
   * Initializes the application and renders initial content.
   *
   * @returns {void}
   * @description
   * Entry point for application initialization. Runs the following sequence:
   * 1. Populates genre filter dropdown with available genres
   * 2. Initializes search modal functionality
   * 3. Binds event listeners to filter and sort controls
   * 4. Renders initial grid with all podcasts
   *
   * @example
   * const app = new PodcastApp();
   * app.init(); // Starts the application
   */
  init() {
    this.populateGenres();
    this.initializeSearchModal();
    this.bindEvents();
    this.render();
  }

  /**
   * Populates the genre filter dropdown with available genres.
   *
   * @returns {void}
   * @description
   * Dynamically generates option elements for each genre in the database.
   * Includes an "All Genres" option as the default.
   *
   * HTML Structure Generated:
   * ```html
   * <select id="genre-filter">
   *   <option value="all">All Genres</option>
   *   <option value="1">Genre Name</option>
   *   ...
   * </select>
   * ```
   *
   * @private
   */
  populateGenres() {
    this.genreFilter.innerHTML =
      '<option value="all">All Genres</option>' +
      genres
        .map((genre) => `<option value="${genre.id}">${genre.title}</option>`)
        .join("");
  }

  /**
   * Attaches event listeners to filter and sort controls.
   *
   * @returns {void}
   * @description
   * Sets up change event listeners for the genre filter and sort dropdown.
   * Also sets up the search button to open the search modal.
   * When either control changes:
   * 1. Updates application state
   * 2. Triggers re-render with new filters/sort applied
   *
   * Events Handled:
   * - Genre filter change: Updates selectedGenre state
   * - Sort filter change: Updates selectedSort state
   * - Search button click: Opens search modal
   *
   * @private
   */
  bindEvents() {
    // Listen for genre filter changes
    this.genreFilter.addEventListener("change", (event) => {
      this.selectedGenre = event.target.value;
      this.render(); // Re-render with new filter
    });

    // Listen for sort option changes
    this.sortFilter.addEventListener("change", (event) => {
      this.selectedSort = event.target.value;
      this.render(); // Re-render with new sort
    });

    // Listen for search button click
    if (this.searchButton) {
      this.searchButton.addEventListener("click", () => {
        createSearchModal.open();
      });
    }
  }

  /**
   * Initializes the search modal with podcasts and event handlers.
   *
   * @returns {void}
   * @description
   * Sets up the search modal module with the podcast data and a callback
   * function that opens the podcast modal when a search result is selected.
   *
   * @private
   */
  initializeSearchModal() {
    createSearchModal.init(podcasts, (podcast) => {
      this.openModal(podcast);
    });
  }

  /**
   * Filters and sorts podcasts based on current application state.
   *
   * @returns {Array<Object>} Array of filtered and sorted podcast objects
   *
   * @description
   * Applies filtering and sorting operations in sequence:
   * 1. Creates a shallow copy of all podcasts
   * 2. Filters by selected genre (if not "all")
   * 3. Sorts by selected criteria
   *
   * Sorting Options:
   * - recent: Most recently updated first
   * - newest: Newly added podcasts first
   * - popular: Most seasons (popularity metric)
   *
   * @example
   * const visible = app.getVisiblePodcasts();
   * console.log(`Showing ${visible.length} podcasts`);
   *
   * @private
   */
  getVisiblePodcasts() {
    // Create shallow copy to avoid mutating original data
    let visible = [...podcasts];

    // Apply genre filter if not "all"
    if (this.selectedGenre !== "all") {
      visible = visible.filter((podcast) =>
        podcast.genres.includes(Number(this.selectedGenre)),
      );
    }

    // Define sorting functions for each option
    const sorters = {
      /**
       * Sort by most recently updated first
       * @param {Object} a - First podcast
       * @param {Object} b - Second podcast
       * @returns {number} Comparison result for sort
       */
      recent: (a, b) => new Date(b.updated) - new Date(a.updated),

      /**
       * Sort by newest podcasts first (by ID)
       * @param {Object} a - First podcast
       * @param {Object} b - Second podcast
       * @returns {number} Comparison result for sort
       */
      newest: (a, b) => Number(b.id) - Number(a.id),

      /**
       * Sort by most popular (most seasons) first
       * @param {Object} a - First podcast
       * @param {Object} b - Second podcast
       * @returns {number} Comparison result for sort
       */
      popular: (a, b) => b.seasons - a.seasons,
    };

    // Apply selected sort
    return visible.sort(sorters[this.selectedSort]);
  }

  /**
   * Renders the podcast grid with current filter and sort applied.
   *
   * @returns {void}
   *
   * @description
   * Orchestrates the rendering of the podcast grid:
   * 1. Gets filtered and sorted podcast list
   * 2. Passes to createGrid functional module
   * 3. Provides callback for handling podcast selection
   *
   * The createGrid module handles:
   * - Creating PodcastCard Web Components
   * - Injecting services into components
   * - Attaching event listeners
   * - Managing component lifecycle
   *
   * @private
   */
  render() {
    createGrid(
      this.grid,
      this.getVisiblePodcasts(),
      this.genreService,
      (podcast) => this.openModal(podcast),
    );
  }

  /**
   * Opens the modal with podcast details.
   *
   * @param {Object} podcast - The podcast data to display in the modal
   * @param {string} podcast.id - Podcast identifier
   * @param {string} podcast.title - Podcast title
   * @param {string} podcast.image - Cover image URL
   * @param {string} podcast.description - Full description
   * @param {number[]} podcast.genres - Genre IDs
   * @param {string} podcast.updated - Update date
   *
   * @returns {void}
   *
   * @description
   * Callback invoked when a user selects a podcast card.
   * Delegates to the createModal module to display details.
   *
   * @example
   * // Called automatically by createGrid when card is clicked
   * app.openModal(podcastData);
   *
   * @private
   */
  openModal(podcast) {
    createModal.open(podcast);
  }
}

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * Auto-initialize the application when the page loads
 *
 * @description
 * Creates a new PodcastApp instance and calls init() to start the application.
 * This runs immediately when the script is loaded (via the defer attribute
 * in the HTML script tag).
 */
new PodcastApp().init();
