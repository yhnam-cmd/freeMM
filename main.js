// ---------- App State ----------
let allPosts = [];
let filtered = [];
let page = 1;
const pageSize = 6;
let scrollPosition = 0;

// ---------- Views ----------
const $ = (s) => document.querySelector(s);
const $feedView = $("#feed-view");
const $postView = $("#post-view");
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
function renderFeaturedGame() {
  const featuredPost = filtered[0];
  if (!featuredPost) {
    $featuredGame.style.display = 'none';
    return;
  }

  $featuredGame.style.backgroundImage = `url(${escapeHtml(featuredPost.image)})`;
  $featuredGame.innerHTML = `
    <div class=\"featured-content\">
        <h2 class=\"featured-title\">${escapeHtml(featuredPost.title)}</h2>
        <p class=\"featured-excerpt\">${escapeHtml(featuredPost.excerpt)}</p>
        <a href=\"#\" class=\"featured-btn\" onclick=\"routeTo('post', { id: '${featuredPost.id}' }); return false;\">View Rewards →</a>
    </div>
  `;
  $featuredGame.style.display = 'block';
}

function renderFeed() {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, totalPages);

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  $("#countPill").textContent = `${total} posts`;

  $("#feed-container").innerHTML = items.map(p => {
    const { mon, day, year } = formatDateParts(p.date);
    const cats = (p.categories || []).map(c => `<a href=\"#\" onclick=\"filterBy('${escapeHtml(c)}');return false;\">${escapeHtml(c)}</a>`).join(", ");

    return `
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
  }).join("");

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
  const links = (post.links || []).map(link =>
    `<li><a href=\"#\" onclick=\"window.open('${escapeHtml(link.url)}', '_blank')\" class=\"btn-link\">${escapeHtml(link.text)} <span aria-hidden=\"true\">→</span></a></li>`
  ).join("");

  $postView.innerHTML = `
    <article class=\"post-full\">
      <button class=\"btn-back\" onclick=\"routeTo('home');\">← Back to list</button>
      <h1>${escapeHtml(post.title)}</h1>
      <div class=\"meta-full\">Published on ${mon} ${day}, ${year}</div>
      <div class=\"post-body\">
        <p>${escapeHtml(post.excerpt)}</p>
        <h3>Available Rewards:</h3>
        <ul class=\"reward-links\">${links.length > 0 ? links : '<li>No reward links available yet.</li>'}</ul>
        <div style=\"margin-top: 24px; text-align: center;\"><a href=\"#\" onclick=\"window.open('${escapeHtml(post.ctaHref)}', '_blank')\" class=\"featured-btn\">Visit Official Site</a></div>
      </div>
    </article>
  `;
}

function renderSidebar() {
    const categories = {};
    const tags = new Set();

    allPosts.forEach(post => {
        (post.categories || []).forEach(cat => {
            categories[cat] = (categories[cat] || 0) + 1;
        });
        (post.tags || []).forEach(tag => tags.add(tag));
    });

    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    $('#widget-categories').innerHTML = sortedCategories.map(([name, count]) =>
        `<a href=\"#\" onclick=\"filterBy('${escapeHtml(name)}');return false;\">\n            <span>${escapeHtml(name)}</span>\n            <span>${count}</span>\n        </a>`
    ).join('');

    $('#widget-tags').innerHTML = Array.from(tags).sort().map(tag =>
        `<a href=\"#\" onclick=\"filterBy('${escapeHtml(tag)}');return false;\">${escapeHtml(tag)}</a>`
    ).join('');
}

// ---------- Routing / Navigation ----------
function routeTo(route, params = {}) {
  document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
  const activeRoute = route === 'post' ? 'home' : route;
  const activeLink = $(`.nav a[data-route='${activeRoute}']`);
  if (activeLink) activeLink.classList.add("active");

  if (route === 'post') {
    scrollPosition = window.scrollY;
    $feedView.style.display = 'none';
    $featuredGame.style.display = 'none';
    $postView.style.display = 'block';
    renderPostDetail(params.id);
    window.scrollTo(0, 0);
  } else {
    $feedView.style.display = 'block';
    $postView.style.display = 'none';
    handleFeedRoute(route);
    window.scrollTo(0, scrollPosition);
    scrollPosition = 0;
  }
}
window.routeTo = routeTo;

function handleFeedRoute(route) {
  switch (route) {
    case 'latest':
      filtered = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'home':
    default:
      // Default sort: posts with links first, then by date
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
  routeTo('home');
}
window.filterBy = filterBy;

function applySearch(query) {
  const q = (query || "").trim().toLowerCase();
  filtered = allPosts.filter(p => {
    const hay = [p.title, p.excerpt, ...(p.categories || []), ...(p.tags || [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
  page = 1;
  renderFeed();
  renderFeaturedGame();
}

// ---------- Init & Event Listeners ----------
async function init() {
  $("#burger").addEventListener("click", () => $("#nav").classList.toggle("open"));
  $("#q").addEventListener("input", e => applySearch(e.target.value));
  $("#year").textContent = new Date().getFullYear();

  await loadData();
  
  // Set initial route to home, which applies the correct sorting
  routeTo('home');
  renderSidebar();
}

document.addEventListener("DOMContentLoaded", init);
