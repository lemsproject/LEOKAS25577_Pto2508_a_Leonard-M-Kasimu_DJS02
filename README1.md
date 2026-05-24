# PodcastApp

A modern, responsive web application for discovering and exploring podcasts with advanced filtering, search, and detailed podcast information.

## Overview

PodcastApp is a single-page application (SPA) built with vanilla JavaScript using Web Components architecture. It provides users with an intuitive interface to browse through a curated collection of podcasts, filter by genre, sort by various criteria, and view detailed information about each show including seasons and metadata.

## Features

- **Podcast Discovery**: Browse through a curated collection of 10+ podcasts
- **Dynamic Filtering**: Filter podcasts by genre categories
- **Smart Sorting**: Sort results by recent updates, popularity, or newest releases
- **Real-Time Search**: Full-text search across podcast titles and descriptions
- **Detailed Views**: Access comprehensive podcast information including:
  - Cover artwork and metadata
  - Genre classifications
  - Season information
  - Last updated timestamps
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Accessible Interface**: ARIA labels and semantic HTML for enhanced accessibility

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Architecture**: Web Components with Shadow DOM encapsulation
- **Design Patterns**:
  - MVC (Model-View-Controller) pattern
  - Module Pattern (IIFE) for encapsulation
  - Dependency Injection for service management
  - Repository Pattern for data access
- **Styling**: CSS3 with responsive grid layout
- **Build**: Modular ES6 imports

## Project Structure

```
PodcastApp/
├── index.html                 # Main HTML template
├── styles.css                 # Global application styles
├── data.js                    # Podcast and genre seed data
├── src/
│   ├── index.js              # Main application controller
│   ├── data.js               # Data models (podcasts, genres, seasons)
│   ├── components/
│   │   ├── PodcastCard.js    # Web Component for podcast cards
│   │   ├── createModal.js    # Modal controller for podcast details
│   │   └── createSearchModal.js # Search modal with filtering
│   ├── views/
│   │   └── createGrid.js     # Grid renderer for podcast cards
│   └── utils/
│       ├── GenreService.js   # Genre lookup and resolution service
│       └── DateUtils.js      # Date formatting utilities
└── assets/
    └── avatar.svg            # User profile avatar
```

## Installation & Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No external dependencies required

### Quick Start

1. **Clone the repository**

```bash
git clone <repository-url>
cd PodcastApp
```

2. **Open in browser**

```bash
# Option 1: Direct file access
open index.html

# Option 2: Local development server (recommended)
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. **Access the application**

- Navigate to `http://localhost:8000` in your browser

## Usage

### Browsing Podcasts

1. **View All**: Browse the full podcast grid on the home page
2. **Filter by Genre**: Select a genre from the filter dropdown
3. **Sort Results**: Choose a sorting preference (Recently Updated, Most Popular, Newest)
4. **Search**: Click the search icon to find podcasts by title or description

### Viewing Podcast Details

1. Click any podcast card to open the detailed modal
2. View podcast cover, title, genres, and description
3. Browse all available seasons with episode counts
4. Close modal by clicking the X button or clicking outside the modal

## Architecture & Design Patterns

### MVC Architecture

- **Model**: `data.js` - Podcast and genre data structures
- **View**: Web Components (`PodcastCard.js`, `createGrid.js`, modals)
- **Controller**: `PodcastApp` class in `index.js` - Orchestrates state and interactions

### Key Design Patterns

**Web Components with Shadow DOM**

- Encapsulation: Styles isolated from global scope
- Reusability: Self-contained podcast card component
- Performance: Efficient DOM updates

**Module Pattern (IIFE)**

- Private state and functions for modals
- Public API for component communication
- Prevents global namespace pollution

**Dependency Injection**

- `GenreService` injected into components
- Loose coupling between components
- Testable and maintainable architecture

**Repository Pattern**

- `GenreService` acts as data repository
- Clean separation of data access logic
- Reusable across multiple components

## Component Documentation

### PodcastCard Web Component

- **Purpose**: Displays individual podcast preview cards
- **Props**: `podcast`, `genreService`
- **Events**: `podcast-selected` event emitted on click
- **Features**: Hover effects, responsive layout, genre tags

### createModal

- **Purpose**: Manages podcast details modal display
- **Methods**: `open(podcast)`, `close()`
- **Features**: Genre resolution, relative date formatting, season list rendering

### createSearchModal

- **Purpose**: Provides real-time podcast search functionality
- **Methods**: `open()`, `close()`
- **Features**: Live filtering, result rendering, user selection callback

### GenreService

- **Purpose**: Resolves genre IDs to human-readable names
- **Methods**: `getTitle(id)`, `getTitles(ids)`
- **Features**: Fallback handling for invalid IDs

### DateUtils

- **Purpose**: Formats dates for display
- **Methods**: `readableDate(dateString)`, `relativeDate(dateString)`
- **Features**: Locale-specific formatting, relative time calculations

## Responsive Breakpoints

- **Desktop**: 4-column grid layout (900px+)
- **Tablet**: 2-column grid layout (640px - 900px)
- **Mobile**: Single-column layout (<640px)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

- **Lazy Rendering**: Components render only when needed
- **DOM Caching**: Frequently accessed elements cached in memory
- **Event Delegation**: Efficient event handling for large lists
- **Shadow DOM**: Style isolation prevents CSS conflicts

## Future Enhancements

- Playlist creation and management
- User ratings and reviews
- Episode playback integration
- Advanced filtering options
- Backend API integration
- Authentication and user profiles
- Podcast recommendations engine

## License

This project is created for educational purposes.

## Author

Leonard M. Kasimu

- ID: LEOKAS25577
- Course: DJS02

---

**Last Updated**: May 24, 2026
