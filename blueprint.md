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
*   **Effects:** Subtle shadows (`--shadow`) for depth on cards and widgets.

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
*   **Functional Links:** All "Collect Freebies" buttons now link directly to the corresponding page on the original `slotfreebies.com` website, making the app immediately useful.
*   **Client-Side Routing Stubs:** Placeholder functions for navigating between different "pages" (Home, Games, About, etc.).

## Current Plan: Phase 4 - Make Links Functional

**Objective:** Update the placeholder links in the JavaScript data source to point to real, functional URLs from the original `slotfreebies.com` website.

1.  **[In Progress]** **Update `main.js` Data:** Modify the `posts` array in `main.js`. Change the `ctaHref` property for each post from `"#"` to the specific URL of the corresponding game's page on `slotfreebies.com`.
2.  **Deploy & Verify:** Push the updated `main.js` file to GitHub to deploy the changes. Verify that clicking the "Collect Freebies" buttons correctly redirects users to the external site.
