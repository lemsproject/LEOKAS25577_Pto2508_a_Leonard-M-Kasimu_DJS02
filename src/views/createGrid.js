import "../components/PodcastCard.js";

/**
 * Grid Renderer Module - Creates and populates podcast card grids
 *
 * @module views/createGrid
 * @description
 * Functional module that handles the creation and rendering of podcast card
 * Web Components into a grid container. Manages service injection, event
 * delegation, and component lifecycle.
 *
 * @example
 * import { createGrid } from './views/createGrid.js';
 *
 * const genreService = new GenreService(genres);
 * createGrid(
 *   document.getElementById('podcast-grid'),
 *   podcastList,
 *   genreService,
 *   (podcast) => handlePodcastSelection(podcast)
 * );
 */

/**
 * Creates and renders podcast cards into a container element.
 *
 * @function createGrid
 * @param {HTMLElement} container - The DOM element where cards will be rendered
 * @param {Array<Object>} podcastList - Array of podcast data objects to render
 * @param {GenreService} genreService - Service instance for resolving genre names
 * @param {Function} onPodcastSelected - Callback invoked when a card is clicked
 *
 * @returns {void}
 *
 * @throws {Error} Logs error if container is not provided
 *
 * @description
 * Functional approach to grid creation:
 * 1. Validates that container exists
 * 2. Clears previous content (innerHTML = "")
 * 3. For each podcast in the list:
 *    - Creates a new podcast-card element
 *    - Injects the genreService dependency
 *    - Sets the podcast property with data
 *    - Attaches event listener for 'podcast-selected' events
 *    - Appends card to container
 *
 * @example
 * // Basic usage
 * const handleSelection = (podcast) => {
 *   console.log(`Selected: ${podcast.title}`);
 *   createModal.open(podcast);
 * };
 *
 * createGrid(
 *   document.getElementById('podcast-grid'),
 *   filteredPodcasts,
 *   genreService,
 *   handleSelection
 * );
 *
 * @example
 * // With filtering and sorting
 * const visiblePodcasts = podcasts
 *   .filter(p => p.genres.includes(selectedGenre))
 *   .sort((a, b) => new Date(b.updated) - new Date(a.updated));
 *
 * createGrid(
 *   container,
 *   visiblePodcasts,
 *   genreService,
 *   handleSelection
 * );
 */
export const createGrid = (
  container,
  podcastList,
  genreService,
  onPodcastSelected,
) => {
  // Validate required container element
  if (!container) {
    console.error("Container element is required");
    return;
  }

  // Clear previous cards to avoid duplicates
  container.innerHTML = "";

  // Render each podcast as a card component
  podcastList.forEach((podcastData) => {
    // Create new Web Component instance
    const card = document.createElement("podcast-card");

    // Inject genre service dependency for name resolution
    card.genreService = genreService;

    // Set podcast data (triggers internal rendering)
    card.podcast = podcastData;

    // Attach event listener for user interaction
    card.addEventListener("podcast-selected", (event) => {
      // Validate callback before invoking
      if (typeof onPodcastSelected === "function") {
        onPodcastSelected(event.detail);
      }
    });

    // Add card to the DOM
    container.appendChild(card);
  });
};
