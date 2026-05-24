/**
 * Search Modal Controller
 *
 * @module createSearchModal
 * @description
 * Creates and manages a search modal for filtering podcasts.
 * Uses the Module Pattern (IIFE) for encapsulation.
 *
 * @example
 * import { podcasts } from "../data.js";
 * import { createSearchModal } from "./createSearchModal.js";
 *
 * const searchModal = createSearchModal(podcasts, (podcast) => {
 *   console.log("Selected:", podcast.title);
 *   // Handle podcast selection
 * });
 *
 * searchModal.open();
 */

export const createSearchModal = (() => {
  let modalState = { isOpen: false };
  let podcastsData = [];
  let onPodcastSelected = null;

  /**
   * Creates the search modal HTML structure
   * @returns {HTMLElement} The search modal backdrop element
   * @private
   */
  const createModalHTML = () => {
    const backdrop = document.createElement("div");
    backdrop.className = "search-modal-backdrop hidden";
    backdrop.id = "search-modal-backdrop";

    backdrop.innerHTML = /* html */ `
      <div class="search-modal">
        <div class="search-header">
          <h2>Search Podcasts</h2>
          <button class="search-close-button" id="searchCloseBtn">&times;</button>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            id="searchInput"
            placeholder="Search by title or description..."
            autocomplete="off"
          />
        </div>
        <div class="search-results" id="searchResults"></div>
      </div>
    `;

    document.body.appendChild(backdrop);
    return backdrop;
  };

  /**
   * Gets or creates the search modal backdrop
   * @returns {HTMLElement} The search modal backdrop
   * @private
   */
  const getSearchBackdrop = () => {
    let backdrop = document.getElementById("search-modal-backdrop");
    if (!backdrop) {
      backdrop = createModalHTML();
    }
    return backdrop;
  };

  /**
   * Searches podcasts based on query
   * @param {string} query - Search query string
   * @returns {Array} Filtered podcasts
   * @private
   */
  const searchPodcasts = (query) => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return podcastsData.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(lowerQuery) ||
        podcast.description.toLowerCase().includes(lowerQuery),
    );
  };

  /**
   * Renders search results to the UI
   * @param {Array} results - Array of podcast objects
   * @private
   */
  const renderResults = (results) => {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<div class="search-empty">No podcasts found. Try another search.</div>';
      return;
    }

    results.forEach((podcast) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";
      resultItem.innerHTML = /* html */ `
        <h3>${podcast.title}</h3>
        <p>${podcast.description}</p>
      `;

      resultItem.addEventListener("click", () => {
        close();
        if (typeof onPodcastSelected === "function") {
          onPodcastSelected(podcast);
        }
      });

      resultsContainer.appendChild(resultItem);
    });
  };

  /**
   * Attaches event listeners to the modal
   * @private
   */
  const bindEvents = () => {
    const backdrop = getSearchBackdrop();
    const closeBtn = backdrop.querySelector("#searchCloseBtn");
    const searchInput = backdrop.querySelector("#searchInput");

    // Close button
    closeBtn.addEventListener("click", close);

    // Close on backdrop click
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        close();
      }
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value;
      const results = searchPodcasts(query);
      renderResults(results);
    });

    // Keyboard: Escape to close
    backdrop.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
  };

  /**
   * Opens the search modal
   * @private
   */
  const open = () => {
    const backdrop = getSearchBackdrop();
    backdrop.classList.remove("hidden");
    modalState.isOpen = true;

    // Focus the search input
    setTimeout(() => {
      const searchInput = backdrop.querySelector("#searchInput");
      if (searchInput) {
        searchInput.focus();
        searchInput.value = "";
        renderResults([]);
      }
    }, 0);
  };

  /**
   * Closes the search modal
   * @private
   */
  const close = () => {
    const backdrop = getSearchBackdrop();
    backdrop.classList.add("hidden");
    modalState.isOpen = false;
  };

  /**
   * Public API
   */
  return {
    /**
     * Initializes the search modal
     * @param {Array} podcasts - Array of podcast objects
     * @param {Function} onSelected - Callback when podcast is selected
     * @returns {void}
     *
     * @example
     * const searchModal = createSearchModal();
     * searchModal.init(podcastsArray, (podcast) => {
     *   console.log("Selected:", podcast.title);
     * });
     */
    init(podcasts, onSelected) {
      podcastsData = podcasts;
      onPodcastSelected = onSelected;
      bindEvents();
    },

    /**
     * Opens the search modal
     * @returns {void}
     *
     * @example
     * searchModal.open();
     */
    open,

    /**
     * Closes the search modal
     * @returns {void}
     *
     * @example
     * searchModal.close();
     */
    close,

    /**
     * Gets the current open state
     * @returns {boolean} True if modal is open
     *
     * @example
     * if (searchModal.isOpen()) {
     *   console.log("Search modal is open");
     * }
     */
    isOpen: () => modalState.isOpen,
  };
})();
