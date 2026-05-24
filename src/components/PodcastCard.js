/**
 * PodcastCard - A reusable Web Component for displaying podcast previews
 *
 * @module components/PodcastCard
 * @description
 * Renders an encapsulated podcast card with cover image, title, genres,
 * season count, and last updated date. Uses Shadow DOM for style isolation.
 *
 * @example
 * // Basic usage with property
 * const card = document.createElement('podcast-card');
 * card.genreService = genreService;
 * card.podcast = podcastData;
 * container.appendChild(card);
 *
 * @example
 * // Listening for user interaction
 * card.addEventListener('podcast-selected', (event) => {
 *   const podcast = event.detail;
 *   console.log(`Selected: ${podcast.title}`);
 * });
 */

import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 * Creates and configures the Shadow DOM template for the podcast card.
 * Contains all styles and markup for the component.
 *
 * @type {HTMLTemplateElement}
 * @constant
 */
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
    :host {
      display: block;
    }

    .card {
      background: white;
      border: 1px solid #e1e5ea;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      border-color: #d0d5df;
    }

    .card:active {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-image-wrapper {
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 6px;
      overflow: hidden;
      background: #f0f2f5;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;
    }

    .card h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.3;
      color: #111827;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .card p {
      margin: 0;
      font-size: 14px;
      color: var(--grey-text, #667085);
      line-height: 1.4;
    }

    .seasons {
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 6px 0 0;
    }

    .tag {
      background: #f0f2f5;
      color: #374151;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      max-width: 100%;
    }

    .tag:hover {
      background: #e5e7eb;
    }

    .updated-text {
      font-size: 12px;
      color: var(--grey-text, #667085);
      margin-top: auto;
      padding-top: 6px;
      border-top: 1px solid #f3f4f6;
      font-weight: 400;
    }

    /* Responsive adjustments */
    @media (max-width: 900px) {
      .card {
        padding: 14px;
      }

      .card h3 {
        font-size: 16px;
      }

      .card p {
        font-size: 13px;
      }

      .tags {
        gap: 5px;
      }

      .tag {
        padding: 5px 8px;
        font-size: 11px;
      }
    }

    @media (max-width: 640px) {
      .card {
        padding: 12px;
      }

      .card-image-wrapper {
        aspect-ratio: 16 / 9;
        margin-bottom: 10px;
      }

      .card h3 {
        font-size: 15px;
        margin-bottom: 4px;
      }

      .card p {
        font-size: 12px;
      }

      .seasons {
        font-size: 12px;
      }

      .tag {
        font-size: 10px;
        padding: 4px 8px;
      }

      .updated-text {
        font-size: 11px;
        padding-top: 4px;
      }
    }
  </style>
  <div class="card">
    <div class="card-image-wrapper">
      <img alt="Podcast cover" loading="lazy" />
    </div>
    <div class="card-content">
      <h3></h3>
      <p class="seasons"></p>
      <div class="tags"></div>
      <p class="updated-text"></p>
    </div>
  </div>
`;

/**
 * Custom Web Component for rendering podcast card previews.
 *
 * A self-contained, encapsulated component that displays podcast information
 * in a clean, responsive card layout. Uses Shadow DOM for style isolation and
 * communicates with parent applications through custom events.
 *
 * @class PodcastCard
 * @extends HTMLElement
 *
 * @property {Object} podcast - The podcast data object to render
 * @property {GenreService} genreService - Service for resolving genre IDs to names
 *
 * @fires podcast-selected - Dispatched when user clicks the card
 *
 * @example
 * // Create and configure the component
 * const card = document.createElement('podcast-card');
 * card.genreService = new GenreService(genres);
 * card.podcast = {
 *   id: "10716",
 *   title: "Something Was Wrong",
 *   image: "https://example.com/cover.jpg",
 *   seasons: 14,
 *   genres: [1, 2],
 *   updated: "2022-11-03T07:00:00.000Z"
 * };
 *
 * @example
 * // Handle user interaction
 * card.addEventListener('podcast-selected', (event) => {
 *   console.log('Selected podcast:', event.detail);
 * });
 */
class PodcastCard extends HTMLElement {
  /**
   * Initializes the PodcastCard component with Shadow DOM and internal state.
   *
   * @constructor
   * @description
   * Sets up the Shadow DOM with the template, queries for DOM elements,
   * initializes private properties, and binds event handlers.
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    /** @type {Object.<string, HTMLElement>} */
    this.elements = {
      card: shadow.querySelector(".card"),
      img: shadow.querySelector("img"),
      title: shadow.querySelector("h3"),
      seasons: shadow.querySelector(".seasons"),
      tags: shadow.querySelector(".tags"),
      updated: shadow.querySelector(".updated-text"),
    };

    this._podcast = null;
    this._genreService = null;
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  /**
   * Sets the GenreService instance for resolving genre IDs to human-readable names.
   *
   * @param {GenreService} service - An instance of GenreService configured with genre data
   * @throws {Error} If service is null or undefined when setting podcast with genres
   * @description
   * Injects the genre service dependency. If podcast data is already loaded,
   * triggers a re-render to resolve genre names immediately.
   *
   * @example
   * const genreService = new GenreService(genresArray);
   * card.genreService = genreService;
   */
  set genreService(service) {
    this._genreService = service;
    // Re-render if podcast data exists to resolve genres
    if (this._podcast) {
      this.renderPodcast();
    }
  }

  /**
   * Specifies which attributes should be monitored for changes.
   *
   * @static
   * @returns {string[]} Array of attribute names to observe
   * @description
   * Web Components lifecycle hook that tells the browser which attributes
   * to watch for changes. When these attributes change, attributeChangedCallback
   * is invoked.
   *
   * @see {@link attributeChangedCallback}
   */
  static get observedAttributes() {
    return ["data"];
  }

  /**
   * Responds to changes in the observed attributes.
   *
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The previous attribute value
   * @param {string} newValue - The new attribute value
   * @description
   * Web Components lifecycle hook. Parses JSON data from the 'data' attribute
   * and triggers re-rendering. Includes error handling for invalid JSON.
   *
   * @example
   * // HTML attribute update
   * card.setAttribute('data', JSON.stringify(podcastObject));
   * // Automatically calls attributeChangedCallback with the new data
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Only handle 'data' attribute changes
    if (name === "data" && newValue) {
      try {
        this._podcast = JSON.parse(newValue);
        this.renderPodcast();
      } catch (error) {
        console.error("Invalid podcast data in attribute:", error);
      }
    }
  }

  /**
   * Retrieves the currently loaded podcast data.
   *
   * @returns {Object|null} The podcast data object or null if not set
   * @description
   * Provides read-only access to the component's internal podcast state.
   *
   * @example
   * const podcast = card.podcast;
   * console.log(podcast.title); // "Something Was Wrong"
   */
  get podcast() {
    return this._podcast;
  }

  /**
   * Sets the podcast data and triggers rendering.
   *
   * @param {Object} podcast - The podcast data to render
   * @param {string} podcast.id - Unique podcast identifier
   * @param {string} podcast.title - Podcast title
   * @param {string} podcast.image - Cover image URL
   * @param {number} podcast.seasons - Number of seasons
   * @param {number[]} podcast.genres - Array of genre IDs
   * @param {string} podcast.updated - ISO 8601 date string
   * @description
   * Primary method for populating the component with data. Validates and
   * triggers rendering of the UI.
   *
   * @example
   * card.podcast = {
   *   id: "10716",
   *   title: "Something Was Wrong",
   *   image: "https://...",
   *   seasons: 14,
   *   genres: [1, 2],
   *   updated: "2022-11-03T07:00:00.000Z"
   * };
   */
  set podcast(podcast) {
    this._podcast = podcast;
    this.renderPodcast();
  }

  /**
   * Sets podcast data (legacy method for backward compatibility).
   *
   * @param {Object} podcast - The podcast data object
   * @deprecated Use the {@link podcast} property setter instead
   * @description
   * Provided for backward compatibility with existing code. New code should
   * use the podcast property: `card.podcast = data`
   *
   * @example
   * // Old way (deprecated)
   * card.setPodcast(podcastData);
   *
   * // New way (preferred)
   * card.podcast = podcastData;
   */
  setPodcast(podcast) {
    this.podcast = podcast;
  }

  /**
   * Handles click events on the card and dispatches a custom event.
   *
   * @private
   * @fires podcast-selected
   * @description
   * Event handler invoked when the user clicks the card. Dispatches a
   * CustomEvent with the podcast data in the detail property. Uses
   * bubbles: true and composed: true to cross Shadow DOM boundaries.
   *
   * @example
   * // Automatically called on card click
   * // Dispatches: new CustomEvent('podcast-selected', {
   * //   detail: this._podcast,
   * //   bubbles: true,
   * //   composed: true
   * // })
   */
  handleCardClick() {
    if (!this._podcast) return;

    this.dispatchEvent(
      new CustomEvent("podcast-selected", {
        detail: this._podcast,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Renders the podcast data into the Shadow DOM elements.
   *
   * @private
   * @description
   * Populates all Shadow DOM elements with data from the podcast object.
   * Handles genre resolution through GenreService and date formatting
   * through DateUtils. Sets up event listeners for user interaction.
   *
   * Process:
   * 1. Validates podcast data exists
   * 2. Destructures required fields
   * 3. Resolves genre IDs to names using GenreService
   * 4. Updates all DOM elements with formatted data
   * 5. Attaches click handler for user interaction
   *
   * @example
   * // Automatically called when podcast property is set
   * card.podcast = podcastData;  // Triggers renderPodcast() internally
   *
   * @throws {Error} Logs error to console if required data is missing
   */
  renderPodcast() {
    if (!this._podcast) return;

    const { image, title, seasons, genres, updated } = this._podcast;

    // Resolve genre IDs to human-readable names
    const genreNames = this._genreService
      ? this._genreService.getTitles(genres)
      : genres.map((id) => `Genre ${id}`);

    // Update image
    this.elements.img.src = image;
    this.elements.img.alt = `${title} cover`;

    // Update title
    this.elements.title.textContent = title;

    // Update seasons (handle singular/plural)
    this.elements.seasons.textContent = `${seasons} season${
      seasons > 1 ? "s" : ""
    }`;

    // Update genre tags
    this.elements.tags.innerHTML = genreNames
      .map((g) => `<span class="tag">${g}</span>`)
      .join("");

    // Update last updated date in human-readable format
    this.elements.updated.textContent = DateUtils.relativeDate(updated);

    // Attach click event handler
    this.elements.card.onclick = this.handleCardClick;
  }
}

customElements.define("podcast-card", PodcastCard);
