# Project Blueprint: Freebies Hub

## 1. Project Overview

**Purpose:** A web application that aggregates and provides the latest freebies (coins, spins, credits) for popular social casino and mobile games. The primary goal is to create a user-friendly, high-value content site that is eligible for and monetized by Google AdSense.

**Target Audience:** Players of social casino and mobile games looking for daily rewards.

**Key Challenge:** To move beyond a simple link aggregator and create a platform with unique, high-quality content that satisfies both users and Google's AdSense program requirements.

---

## 2. Current Implemented Features (as of Initial Blueprint)

This section documents the foundational features that have been implemented so far.

### Core Application Structure

*   **Frontend:** Built with modern, framework-less HTML, CSS, and JavaScript.
*   **Routing:** A simple client-side router in `main.js` handles navigation between different views (e.g., home, post details).
*   **UI Components:**
    *   Homepage feed (`#feed-view`) to display a list of game freebies.
    *   Single post detail view (`#post-view`) for future content expansion.
    *   Responsive design for mobile and desktop.
    *   Dynamic sidebar for popular and trending content.

### Essential Pages & Policies

*   **About Page (`about.html`):** Explains the site's mission and what it does.
*   **Privacy Policy Page (`privacy.html`):** Standard privacy policy, a key requirement for AdSense.
*   **Contact Page (`contact.html`):** Provides a way for users to get in touch.

### Monetization & Compliance

*   **Google AdSense Integration:** AdSense script (`adsbygoogle.js`) has been added to the `<head>` of all user-facing HTML files (`index.html`, `about.html`, `privacy.html`, `contact.html`).
*   **Consent Management Platform (CMP):** CookieYes script is integrated to manage user consent for cookies, fulfilling GDPR and other privacy regulation requirements.

---

## 3. The Path Forward: Content Enhancement Plan

This section outlines the strategic steps to transform the site into a high-value content platform, crucial for AdSense approval and long-term success.

### Step 1: Implement Game-Specific Detail Pages (The Core Task)

*   **Objective:** Move from a simple list of links to rich, informative pages for each game.
*   **Actionable Steps:**
    1.  **Create a `GameDetail` Web Component:** Develop a reusable web component to structure the content for each game's detail page.
    2.  **Dynamic Content Rendering:** When a user clicks on a game in the feed, the router will:
        *   Hide the main feed view (`#feed-view`).
        *   Display the detail view (`#post-view`).
        *   Dynamically inject the `GameDetail` component, populated with the specific game's data.
    3.  **Content Requirements for Each Page:**
        *   **Unique Game Description:** A well-written, original paragraph describing the game's theme, gameplay, and why it's popular. **This is not to be copied from other sites.**
        *   **Game-Specific Imagery:** A high-quality banner or screenshot for the game.
        *   **Organized Freebie Links:** A clear, updated list of the latest freebie links for that game, with dates.
*   **Success Metric:** A user can navigate from the homepage to a detailed page for any game, which contains unique, helpful content beyond just a list of links.

### Step 2: Homepage Redesign for Better User Engagement

*   **Objective:** Make the homepage more dynamic and engaging.
*   **Actionable Steps:**
    1.  **"Featured Game" Section:** Add a prominent section at the top of the homepage to highlight a specific game.
    2.  **"Recently Added" Feed:** Create a chronological list of the latest freebie links added across all games.

### Step 3: Author and Publish Unique Content

*   **Objective:** Create the actual written content required for the detail pages. This is the most critical part for AdSense approval.
*   **Actionable Steps:**
    1.  **Research and Write:** For each game in the `games.json` file, write a unique, engaging description.
    2.  **Gather Imagery:** Find or create appropriate images for each game.
    3.  **Populate the `games.json`:** Add new fields to the `games.json` data structure to hold these descriptions and image URLs.
