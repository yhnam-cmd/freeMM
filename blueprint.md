# Project Blueprint: Freebies Hub

## 1. Project Overview

**Purpose:** A web application that aggregates and provides the latest freebies for popular social & mobile games. The primary goal is to create a user-friendly, high-value content site optimized for search engines and monetized by Google AdSense.

**Target Audience:** Players of social casino and mobile games looking for daily rewards.

---

## 2. Core Features & Design Philosophy

This section documents the foundational features and the guiding principles behind them.

### Application & Design
*   **Tech Stack:** Modern, framework-less HTML, CSS, and JavaScript for optimal performance and maintainability.
*   **Layout:** A responsive main grid layout with a primary content area and a sidebar for supplementary information (widgets).
*   **Routing:** A client-side router in `main.js` handles seamless view transitions without full page reloads.
*   **Data:** Game and post information is managed via a static `posts.json` file, allowing for easy updates.

### Content & User Experience
*   **Homepage:** A feed that prioritizes posts with active reward links, followed by the latest content, ensuring users see the most valuable information first.
*   **Post Details:** Each game has a detail page showing specific reward links.
*   **Essential Pages:** Includes `About`, `Privacy Policy`, and `Contact` pages to build trust and meet AdSense requirements.
*   **Monetization & Compliance:** Integrated with Google AdSense and a CookieYes Consent Management Platform.

---

## 3. User Acquisition & SEO Strategy

This is the strategic plan to attract users from search engines and provide clear, valuable navigation pathways within the site.

### A. Technical SEO Foundation

*Objective: Ensure search engines can efficiently crawl, index, and understand our site structure.*

1.  **`sitemap.xml` Creation:**
    *   **Action:** Generate and add a `sitemap.xml` file to the project root.
    *   **Content:** This sitemap will list the URLs for all critical pages: the homepage, static pages (`about.html`, `privacy.html`), and—most importantly—a unique, crawlable URL for every single game post.
2.  **`robots.txt` Implementation:**
    *   **Action:** Create a `robots.txt` file.
    *   **Content:** This file will instruct search engine crawlers on which parts of the site to access and will point them to the location of the `sitemap.xml` for efficient discovery.
3.  **Dynamic Meta Tags:**
    *   **Action:** Enhance the client-side router in `main.js`.
    *   **Functionality:** When a user navigates to a game's detail page, the script will dynamically update the document's `<title>` and `<meta name="description">`. 
    *   **Example:** Viewing the 'Slotomania' post will set the title to `Slotomania Free Coins & Rewards | SF Freebies Hub` and generate a relevant description, making each post a unique entry point from search results.

### B. Feature-Driven SEO & UX

*Objective: Create dedicated features that improve user experience and create more content-rich pages for search engines to rank.*

1.  **"Games" Tab - The Game Directory:**
    *   **Plan:** Create a new view/page dedicated to showcasing all games the site covers.
    *   **Implementation:** It will render a grid of game cards, sorted alphabetically. Each card will display the game's logo and name, linking directly to its detail page. 
    *   **SEO Value:** Creates a content-rich hub page that links to all individual game pages, improving the site's internal linking structure.

2.  **"Search" Tab - Dedicated Search Experience:**
    *   **Plan:** Implement a full-page search interface.
    *   **Implementation:** This page will feature a prominent search bar. In the future, it can be expanded with advanced filters (e.g., by category, tags).
    *   **SEO Value:** While not directly a ranking factor, a good search experience keeps users on the site longer, which is a positive signal to search engines.

### C. Content Strategy

*Objective: Solidify our position as a valuable resource through high-quality, unique content.*

*   **Unique Descriptions:** Continue the established practice of writing original, helpful descriptions for every game post. This is the single most important factor for On-Page SEO.
*   **Keyword Optimization:** Naturally integrate user-searched terms (e.g., "free dice," "daily spins") into titles, excerpts, and descriptions.

---

## 4. Current Task: Implement Social Sharing & Fix Images

*   **Objective:** Increase user engagement and organic traffic by allowing users to share posts, and improve visual consistency by fixing broken images.

*   **Phase 1: Image Correction (Completed)**
    1.  **Problem:** Placeholder images in the "All Games" directory were broken or irrelevant.
    2.  **Solution:** Updated `posts.json` to use the Clearbit API (`logo.clearbit.com/:domain`). This dynamically fetches the official logo for each game based on its `ctaHref` (official website), ensuring all images are relevant and professional.

*   **Phase 2: Social Sharing Implementation (In Progress)**
    1.  **Goal:** Add 'Share' buttons (Facebook, Twitter, Email, etc.) to each game detail page.
    2.  **Mechanism:** These buttons will not link to our own social media profiles. Instead, they will open a new window for the user to post the current page's URL directly to their own social feed, effectively creating user-generated marketing.
    3.  **Action Items:**
        *   Update `main.js` to include a `renderShareButtons` function that generates the necessary HTML and logic.
        *   The function will dynamically create share URLs (e.g., `https://www.facebook.com/sharer/sharer.php?u=...`).
        *   Update `style.css` to ensure the new share buttons are visually appealing and well-integrated into the post detail view.
