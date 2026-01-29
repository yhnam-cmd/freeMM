# Project Blueprint: Freebies Hub

## Overview

This project creates a clean, fast, and responsive blog-style web application for aggregating daily freebies for social casino and casual games. The design is light, modern, and information-focused, with a clear separation between the main content feed and a sidebar for navigation and widgets.

## Design & Features Outline

### 1. Visual Design (Aesthetics)
*   **Theme:** Light and clean. Uses a palette of whites, grays, and blues for a professional, easy-to-read interface.
*   **Color Palette:** 
    *   Background: `#f4f6f8`
    *   Cards/Widgets: `#ffffff`
    *   Text: `#1f2937`
    *   Accent: `#2563eb`
*   **Typography:** System UI fonts for native performance and readability.
*   **Layout:** A responsive two-column layout featuring a main post feed and a sticky sidebar. Collapses to a single column on mobile.
*   **Effects:** Subtle shadows (`--shadow`) for depth on cards and widgets. No glow effects.

### 2. Core Components
*   **Header:** Sticky top-bar with logo, navigation links, and a prominent search bar.
*   **Post Item:** A repeatable element in the feed, displaying a date box, title, excerpt, tags, and a primary "Collect" button.
*   **Sidebar:** Contains widgets for popular/trending games and other metadata.
*   **Footer:** Multi-column footer with navigation links and site information.
*   **Pagination:** Numbered page navigation for the main feed.

### 3. Functionality
*   **Dynamic Post Loading:** Posts are rendered from a JavaScript data source.
*   **Pagination:** The feed is paginated, showing a limited number of posts per page.
*   **Live Search/Filter:** The search bar filters posts in real-time by title, category, or tag.
*   **Client-Side Routing Stubs:** Placeholder functions for navigating between different "pages" (Home, Games, About, etc.).

## Current Plan: Phase 3 - Complete Overhaul to 'Freebies Hub' Design

**Objective:** Replace the previous "dark-glow" theme entirely with the user-provided "light-blog" theme.

1.  **[In Progress]** **Deconstruct & Reorganize:** Split the provided single HTML file into three separate, clean files: `index.html` (structure), `style.css` (presentation), and `main.js` (logic).
2.  **Overwrite `index.html`:** Replace the existing HTML body with the new, more complex structure including the header, main container (feed + sidebar), and footer.
3.  **Overwrite `style.css`:** Replace all previous CSS with the new light-theme styles.
4.  **Overwrite `main.js`:** Replace the previous Web Component and filtering logic with the new, comprehensive script that includes data, rendering, pagination, and routing.
5.  **Deploy & Verify:** Push all changes to GitHub to deploy the completely new site design and verify its appearance and functionality.
