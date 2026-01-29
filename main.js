// ---------- App State ----------
let allPosts = [];
let popular = [];
let trending = [];
let filtered = [];
let page = 1;
const pageSize = 6;
let scrollPosition = 0;

// ---------- Views ----------
const $ = (s) => document.querySelector(s);
const $feedView = $("#feed-view");
const $postView = $("#post-view");

// ---------- Utilities ----------
const escapeHtml = (str) =>
  String(str || '').replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
     .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function formatDateParts(iso){
  const d = new Date(iso + "T00:00:00");
  const mon = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return { mon, day, year };
}

// ---------- Data Loading ----------
async function loadData() {
    try {
        const [postsRes, popularRes, trendingRes] = await Promise.all([
            fetch('posts.json'),
            fetch('popular.json'),
            fetch('trending.json')
        ]);
        if (!postsRes.ok) throw new Error(`Posts fetch failed: ${postsRes.statusText}`);
        if (!popularRes.ok) throw new Error(`Popular fetch failed: ${popularRes.statusText}`);
        if (!trendingRes.ok) throw new Error(`Trending fetch failed: ${trendingRes.statusText}`);
        
        allPosts = await postsRes.json();
        popular = await popularRes.json();
        trending = await trendingRes.json();
        
        filtered = [...allPosts];
    } catch (e) {
        console.error("Failed to load initial data:", e);
        $feedView.innerHTML = `<p class=\"error\">Failed to load content. Please check your connection and try again later.</p>`;
    }
}

// ---------- Rendering ----------
function renderFeed(){
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, totalPages);

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  $("#countPill").textContent = `${total} posts`;

  $("#feed").innerHTML = items.map(p => {
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
    const pages = [];
    for(let i=1; i<=totalPages; i++){
        pages.push(`<a class=\"page ${i===page?'active':''}\" href=\"#\" onclick=\"gotoPage(${i});return false;\">${i}</a>`);
    }
    const next = page < totalPages ? `<a class=\"page\" href=\"#\" onclick=\"gotoPage(${page+1});return false;\">Next »</a>` : "";
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
        `<li><a href=\"${escapeHtml(link.url)}\" class=\"btn-link\" target=\"_blank\">${escapeHtml(link.text)} <span aria-hidden=\"true\">→</span></a></li>`
    ).join("");

    $postView.innerHTML = `
        <article class=\"post-full\">
            <button class=\"btn-back\" onclick=\"routeTo('home');\">← Back to list</button>
            <h1>${escapeHtml(post.title)}</h1>
            <div class=\"meta-full\">Published on ${mon} ${day}, ${year}</div>
            <div class=\"post-body\">
                <p>${escapeHtml(post.excerpt)}</p>
                <h3>Available Rewards:</h3>
                <ul class=\"reward-links\">
                    ${links.length > 0 ? links : '<li>No reward links available for this post yet.</li>'}
                </ul>
                 <div style=\"margin-top: 24px; text-align: center;\"><a href=\"${escapeHtml(post.ctaHref)}\" class=\"btn\" target=\"_blank\">View all on Official Site</a></div>
            </div>
        </article>
    `;
}

function renderSidebar(){
    $("#popularList").innerHTML = popular.map(name =>
        `<li><a href=\"#\" onclick=\"filterBy('${escapeHtml(name)}');return false;\">${escapeHtml(name)} <span>↗</span></a></li>`
    ).join("");

    $("#trendingList").innerHTML = trending.map(name =>
        `<li><a href=\"#\" onclick=\"filterBy('${escapeHtml(name)}');return false;\">${escapeHtml(name)} <span>↗</span></a></li>`
    ).join("");
}

function hydrateFooter(){
      const topPopular = popular.slice(0,7).map(n => `<a href=\"#\" onclick=\"filterBy('${escapeHtml(n)}');return false;\">${escapeHtml(n)}</a>`).join("");
      $("#footerPopular").innerHTML = topPopular;

      const latest = [...allPosts]
        .sort((a,b) => b.date.localeCompare(a.date))
        .slice(0,7)
        .map(p => `<a href=\"#\" onclick=\"routeTo('post', { id: '${p.id}' });return false;\">${escapeHtml(p.title)}</a>`)
        .join("");

      $("#footerLatest").innerHTML = latest;
}

// ---------- Routing / Navigation ----------
function routeTo(route, params = {}){
    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const activeRoute = route === 'post' ? 'home' : route;
    const activeLink = document.querySelector(`.nav a[data-route='${activeRoute}']`);
    if(activeLink) activeLink.classList.add("active");

    if (route === 'post') {
        scrollPosition = window.scrollY;
        $feedView.style.display = 'none';
        $postView.style.display = 'block';
        renderPostDetail(params.id);
        window.scrollTo(0, 0);
    } else {
        $feedView.style.display = 'block';
        $postView.style.display = 'none';
        handleFeedRoute(route);
        window.scrollTo(0, scrollPosition);
        scrollPosition = 0; // Reset after use
    }
}
window.routeTo = routeTo; // Make it globally accessible

function handleFeedRoute(route) {
    switch(route) {
        case 'search':
            $("#q").focus();
            return; // Don't reset filter, just focus
        case 'latest':
            filtered = [...allPosts].sort((a,b) => b.date.localeCompare(a.date));
            break;
        case 'games':
        case 'about':
        case 'cookie':
            alert('This page is under construction.');
            // Fall-through to home is intentional to show default list
        case 'home':
        default:
            filtered = [...allPosts];
            break;
    }
    page = 1;
    $("#q").value = "";
    renderFeed();
    hydrateFooter(); 
}

function gotoPage(p){ 
    page = p; 
    renderFeed(); 
    window.scrollTo(0, 0); 
}
window.gotoPage = gotoPage;

function filterBy(token){
  const t = token.toLowerCase();
  $("#q").value = token;
  applySearch(t);
  routeTo('home'); // Switch view to home to show results
}
window.filterBy = filterBy;

function applySearch(query) {
    const q = (query || "").trim().toLowerCase();
    filtered = allPosts.filter(p => {
        const hay = [p.title, p.excerpt, ...(p.categories||[]), ...(p.tags||[])].join(" ").toLowerCase();
        return hay.includes(q);
    });
    page = 1;
    renderFeed();
    hydrateFooter();
}

// ---------- Init & Event Listeners ----------
async function init() {
    await loadData();
    renderFeed();
    renderSidebar();
    hydrateFooter();

    $("#q").addEventListener("input", (e) => applySearch(e.target.value));
    
    // mobile nav toggle
    $("#burger").addEventListener("click", () => {
      $("#nav").classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", init);
