// ---------- App State ----------
let allPosts = [];
let filtered = [];
let page = 1;
const pageSize = 6;
let scrollPosition = 0;
const AD_INJECT_INTERVAL = 3; // Show an ad every 3 posts

// ---------- Views ----------
const $ = (s) => document.querySelector(s);
const $feedView = $("#feed-view");
const $postView = $("#post-view");
const $gamesView = $("#games-view");
const $searchView = $("#search-view");
const $featuredGame = $("#featured-game");
const $container = $(".container");

// ---------- Utilities ----------
const escapeHtml = (str) =>
  String(str || '')
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function formatDateParts(iso) {
  const d = new Date(iso + "T00:00:00");
  return {
    mon: d.toLocaleString("en-US", { month: "short" }),
    day: String(d.getDate()).padStart(2, "0"),
    year: d.getFullYear(),
  };
}

// ---------- SEO ----------
function updateMetaTags(route, params = {}) {
    const head = document.head;
    // Clear old post-specific meta tags
    head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(tag => tag.remove());

    const metaDesc = head.querySelector('meta[name="description"]');
    let title = "SF Freebies Hub - Daily Game Rewards";
    let description = "Your one-stop hub for daily freebies, coins, spins, and rewards for your favorite online games.";
    let postUrl = `https://sf-freebies-hub.web.app/`;
    let imageUrl = `https://sf-freebies-hub.web.app/assets/og-image.png`; // Default OG image

    if (route === 'post' && params.id) {
        const post = allPosts.find(p => p.id === params.id);
        if (post) {
            title = `${post.title} | SF Freebies Hub`;
            description = post.excerpt;
            postUrl = `${window.location.origin}${window.location.pathname}#!/post/${post.id}`;
            imageUrl = post.image;
            updateStructuredData(post);

            // Add Open Graph and Twitter Card meta tags for social sharing
            const tags = {
                'og:title': title,
                'og:description': description,
                'og:type': 'article',
                'og:url': postUrl,
                'og:image': imageUrl,
                'twitter:card': 'summary_large_image',
                'twitter:title': title,
                'twitter:description': description,
                'twitter:image': imageUrl
            };
            for (const [key, value] of Object.entries(tags)) {
                const meta = document.createElement('meta');
                meta.setAttribute(key.startsWith('og') ? 'property' : 'name', key);
                meta.setAttribute('content', value);
                head.appendChild(meta);
            }
        }
    } else {
        clearStructuredData(); // Clear on any other page
        if (route === 'games') {
            title = 'All Games | SF Freebies Hub';
            description = 'Browse the full directory of games we provide freebies for.';
        } else if (route === 'search') {
            title = 'Search | SF Freebies Hub';
            description = 'Search for specific games, freebies, and rewards.';
        } else if (route === 'latest') {
            title = 'Latest Rewards | SF Freebies Hub';
            description = 'The most recently added freebies and rewards, sorted chronologically.';
        }
    }

    document.title = title;
    metaDesc.setAttribute('content', description);
}


function clearStructuredData() {
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
        existingSchema.remove();
    }
}

function updateStructuredData(post) {
    clearStructuredData(); // Remove old schema first

    const postUrl = `${window.location.origin}${window.location.pathname}#!/post/${post.id}`;
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": postUrl
                },
                "headline": post.title,
                "description": post.excerpt,
                "image": post.image,
                "author": {
                    "@type": "Organization",
                    "name": "SF Freebies Hub"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "SF Freebies Hub",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${window.location.origin}/assets/logo.png` // Assuming you have a logo
                    }
                },
                "datePublished": post.date
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${window.location.origin}${window.location.pathname}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": post.title
                    }
                ]
            }
        ]
    };

    if (post.links && post.links.length > 0) {
        schema["@graph"].push({
            "@type": "FAQPage",
            "mainEntity": post.links.map(link => ({
                "@type": "Question",
                "name": `How to get ${link.text}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `You can claim your freebie by clicking this link: <a href=\"${link.url}\">Claim ${link.text}</a>.`
                }
            }))
        });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// ---------- Data Loading ----------
async function loadData() {
  try {
    const res = await fetch('posts.json');
    if (!res.ok) throw new Error(`Failed to load posts: ${res.statusText}`);
    allPosts = await res.json();
  } catch (e) {
    console.error("Data loading error:", e);
    $container.innerHTML = `<p class=\"error\">Failed to load content. Please try again later.</p>`;
  }
}

// ---------- Rendering ----------
function renderAd(type) {
  return `
    <div class="ad-slot ad-${type}">
      <small>Advertisement</small>
      <div style="background:#222; width:100%; height:100px; display:flex; align-items:center; justify-content:center; text-align:center;">
        Ad Placeholder
      </div>
    </div>`;
}

function renderFeed() {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, totalPages);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  $("#countPill").textContent = `${total} posts`;
  
  let html = '';
  items.forEach((p, index) => {
    const { mon, day, year } = formatDateParts(p.date);
    const cats = (p.categories || []).map(c => `<a href=\"#\" onclick=\"filterBy('${escapeHtml(c)}');return false;\">${escapeHtml(c)}</a>`).join(", ");
    html += `
      <article class=\"post\">
        <div class=\"datebox\" aria-label=\"Post date\">
          <div class=\"mon\">${escapeHtml(mon)}</div>
          <div class=\"day\">${escapeHtml(day)}</div>
          <div class=\"year\">${escapeHtml(String(year))}</div>
        </div>
        <div>
          <h2><a href=\"#\" onclick=\"routeTo('post', { id: '${p.id}' });return false;\">${escapeHtml(p.title)}</a></h2>
          <p class=\"excerpt\">${escapeHtml(p.excerpt)}</p>
          <div class=\"meta\">Posted in ${cats}</div>
        </div>
      </article>
    `;
    if ((index + 1) % AD_INJECT_INTERVAL === 0) {
        html += renderAd('feed');
    }
  });

  $("#feed-container").innerHTML = html;
  renderPager(totalPages);
}

function renderPager(totalPages) {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(`<a class=\"page ${i === page ? 'active' : ''}\" href=\"#\" onclick=\"gotoPage(${i});return false;\">${i}</a>`);
  }
  const next = page < totalPages ? `<a class=\"page\" href=\"#\" onclick=\"gotoPage(${page + 1});return false;\">Next »</a>` : "";
  $("#pager").innerHTML = pages.join("") + (next ? ` <span style=\"flex:1\"></span> ${next}` : "");
}

function renderPostDetail(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) {
    $postView.innerHTML = `<p class=\"error\">Post not found.</p><button class=\"btn-back\" onclick=\"routeTo('home');\">← Back to list</button>`;
    return;
  }
  const { mon, day, year } = formatDateParts(post.date);
  
  const faqHtml = (post.links && post.links.length > 0) 
    ? (post.links || []).map(link => `
        <div class=\"faq-item\">
            <p class="faq-q">Q: How do I claim ${escapeHtml(link.text)}?</p>
            <p class="faq-a">A: <a href=\"#\" onclick=\"window.open('${escapeHtml(link.url)}', '_blank')\" class=\"btn-link-inline\">Click here to claim your reward!</a></p>
        </div>
      `).join("")
    : '<p>No reward links available yet.</p>';

  const shareButtonsHtml = renderShareButtons(post);
  const relatedPostsHtml = renderRelatedPosts(post);

  $postView.innerHTML = `
    <article class=\"post-full\">
      <button class=\"btn-back\" onclick=\"routeTo('home');\">← Back to list</button>
      <h1>${escapeHtml(post.title)}</h1>
      <div class=\"meta-full\">Published on ${mon} ${day}, ${year}</div>
      <div class=\"post-body\">
        <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="post-full-image">
        <p>${escapeHtml(post.excerpt)}</p>
        <h3>Available Rewards (FAQ):</h3>
        <div class=\"faq-container\">${faqHtml}</div>
        ${renderAd('post-detail')}
        <div style=\"margin-top: 24px; text-align: center;\"><a href=\"#\" onclick=\"window.open('${escapeHtml(post.ctaHref)}', '_blank')\" class=\"featured-btn\">Visit Official Site</a></div>
        ${shareButtonsHtml}
        ${relatedPostsHtml}
      </div>
    </article>
  `;
}

function renderGamesDirectory() {
    const uniqueGamesMap = new Map();
    allPosts.forEach(post => {
        if (!uniqueGamesMap.has(post.title)) {
            uniqueGamesMap.set(post.title, post);
        }
    });
    const uniqueGames = Array.from(uniqueGamesMap.values()).sort((a, b) => a.title.localeCompare(b.title));
    $('#games-grid').innerHTML = uniqueGames.map(p => `
        <a href="#" class="game-card" onclick="routeTo('post', { id: '${p.id}' }); return false;">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">
            <h3>${escapeHtml(p.title)}</h3>
        </a>
    `).join('');
}

function renderSearchResults(query) {
    const q = (query || "").trim().toLowerCase();
    const resultsContainer = $('#search-results-container');
    if (!q) {
        resultsContainer.innerHTML = '<p class="widget-text">Enter a term above to start searching.</p>';
        return;
    }
    const results = allPosts.filter(p => {
        const hay = [p.title, p.excerpt, ...(p.categories || []), ...(p.tags || [])].join(" ").toLowerCase();
        return hay.includes(q);
    });
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="widget-text">No results found for your query.</p>';
        return;
    }
    resultsContainer.innerHTML = results.map(p => {
        const { mon, day, year } = formatDateParts(p.date);
        return `
          <article class=\"post\">
            <div class=\"datebox\" aria-label=\"Post date\">
              <div class=\"mon\">${escapeHtml(mon)}</div>
              <div class=\"day\">${escapeHtml(day)}</div>
              <div class=\"year\">${escapeHtml(String(year))}</div>
            </div>
            <div>
              <h2><a href="#" onclick="routeTo('post', { id: '${p.id}' });return false;">${escapeHtml(p.title)}</a></h2>
              <p class="excerpt">${escapeHtml(p.excerpt)}</p>
            </div>
          </article>
        `;
    }).join('');
}

function renderShareButtons(post) {
    const postUrl = `${window.location.origin}${window.location.pathname}#!/post/${post.id}`;
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(post.title);
    const text = encodeURIComponent(`Check out the rewards for ${post.title}!`);

    return `
    <div class=\"share-widget\">
      <h3>Share These Rewards</h3>
      <div class=\"share-buttons\">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" onclick="sharePopup(this.href, 'Facebook'); return false;" class="share-btn facebook" aria-label="Share on Facebook">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}" onclick="sharePopup(this.href, 'Twitter'); return false;" class="share-btn twitter" aria-label="Share on Twitter">Twitter</a>
        <a href="http://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}" onclick="sharePopup(this.href, 'Reddit'); return false;" class="share-btn reddit" aria-label="Share on Reddit">Reddit</a>
        <a href="mailto:?subject=${encodedTitle}&body=Check out these rewards: ${encodedUrl}" class="share-btn email" aria-label="Share via Email">Email</a>
      </div>
    </div>
  `;
}

function renderRelatedPosts(currentPost) {
    const related = allPosts.filter(p => 
        p.id !== currentPost.id && 
        p.categories.some(cat => currentPost.categories.includes(cat))
    ).slice(0, 4); // Get up to 4 related posts

    if (related.length === 0) return '';

    const itemsHtml = related.map(p => `
        <a href="#" class="related-post-card" onclick="routeTo('post', { id: '${p.id}' }); return false;">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">
            <h4>${escapeHtml(p.title)}</h4>
        </a>
    `).join('');

    return `
        <div class=\"related-posts-widget\">
            <h3>You Might Also Like</h3>
            <div class=\"related-posts-grid\">${itemsHtml}</div>
        </div>
    `;
}

function renderFeaturedGame() {
    const featured = allPosts.find(p => p.featured);
    if (!featured) {
        $featuredGame.style.display = 'none';
        return;
    }
    $featuredGame.innerHTML = `
        <div class="featured-content">
            <img src="${escapeHtml(featured.image)}" alt="Featured game" class="featured-image">
            <div class="featured-info">
                <h2>${escapeHtml(featured.title)}</h2>
                <p>${escapeHtml(featured.excerpt)}</p>
                <a href="#" onclick="routeTo('post', {id: '${featured.id}'}); return false;" class="featured-btn">Get Rewards</a>
            </div>
        </div>
    `;
    $featuredGame.style.display = 'block';
}

function renderSidebar() {
    const categories = {};
    const tags = new Set();
    allPosts.forEach(post => {
        (post.categories || []).forEach(cat => { categories[cat] = (categories[cat] || 0) + 1; });
        (post.tags || []).forEach(tag => tags.add(tag));
    });
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    $('#widget-categories').innerHTML = sortedCategories.map(([name, count]) =>
        `<a href="#" onclick="filterBy('${escapeHtml(name)}');return false;">
            <span>${escapeHtml(name)}</span><span>${count}</span>
        </a>`).join('');
    $('#widget-tags').innerHTML = Array.from(tags).sort().map(tag =>
        `<a href="#" onclick="filterBy('${escapeHtml(tag)}');return false;">${escapeHtml(tag)}</a>`).join('');
}

// ---------- Routing / Navigation ----------
function routeTo(newRoute, params = {}) {
    // Handle hash updates
    let hash = `#!/${newRoute}`;
    if (params.id) {
        hash += `/${params.id}`;
    }
    if (window.location.hash !== hash) {
        history.pushState({ route: newRoute, params }, null, hash);
    }

    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const activeRoute = newRoute === 'post' ? 'home' : newRoute;
    const activeLink = $(`.nav a[data-route='${activeRoute}']`);
    if (activeLink) activeLink.classList.add("active");

    updateMetaTags(newRoute, params);

    $feedView.style.display = 'none';
    $postView.style.display = 'none';
    $gamesView.style.display = 'none';
    $searchView.style.display = 'none';
    $featuredGame.style.display = 'none';

    switch (newRoute) {
        case 'post':
            scrollPosition = window.scrollY;
            $postView.style.display = 'block';
            renderPostDetail(params.id);
            window.scrollTo(0, 0);
            break;
        case 'games':
            $gamesView.style.display = 'block';
            renderGamesDirectory();
            window.scrollTo(0, 0);
            break;
        case 'search':
            $searchView.style.display = 'block';
            renderSearchResults($('#search-page-input').value);
            window.scrollTo(0, 0);
            break;
        case 'home':
        case 'latest':
        default:
            $feedView.style.display = 'block';
            $featuredGame.style.display = 'block';
            handleFeedRoute(newRoute);
            window.scrollTo(0, scrollPosition);
            scrollPosition = 0;
            break;
    }
}
window.routeTo = routeTo;

function sharePopup(url, title) {
  const width = 600;
  const height = 600;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  window.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`);
}
window.sharePopup = sharePopup;

function handleFeedRoute(route) {
  switch (route) {
    case 'latest':
      filtered = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'home':
    default:
      filtered = [...allPosts].sort((a, b) => {
        const aHasRealLinks = a.links && a.links.length > 0 && a.links.some(l => l.url !== '#');
        const bHasRealLinks = b.links && b.links.length > 0 && b.links.some(l => l.url !== '#');
        if (aHasRealLinks && !bHasRealLinks) return -1;
        if (!aHasRealLinks && bHasRealLinks) return 1;
        return new Date(b.date) - new Date(a.date);
      });
      break;
  }
  page = 1;
  $("#q").value = "";
  renderFeed();
  renderFeaturedGame();
}

function gotoPage(p) {
  page = p;
  renderFeed();
  window.scrollTo(0, 0);
}
window.gotoPage = gotoPage;

function filterBy(token) {
  $("#q").value = token;
  applySearch(token);
}
window.filterBy = filterBy;

function applySearch(query) {
    const q = (query || "").trim().toLowerCase();
    if (q) {
        routeTo('search');
        $('#search-page-input').value = q;
        renderSearchResults(q);
    } else {
        routeTo('home');
    }
}

// ---------- Init & Event Listeners ----------
async function init() {
  $("#burger").addEventListener("click", () => $("#nav").classList.toggle("open"));
  
  $("#q").addEventListener("keypress", e => {
      if (e.key === 'Enter') {
          applySearch(e.target.value);
      }
  });

  $('#search-page-input').addEventListener('input', e => renderSearchResults(e.target.value));
  
  $("#year").textContent = new Date().getFullYear();

  await loadData();
  
  function handleInitialRoute() {
      const hash = window.location.hash.slice(2);
      const [route, id] = hash.split('/');
      routeTo(route || 'home', { id });
  }

  handleInitialRoute();
  renderSidebar();

  window.addEventListener('popstate', handleInitialRoute);
}

document.addEventListener("DOMContentLoaded", init);
