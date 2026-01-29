// ---------- App State ----------
let allPosts = [];
let filtered = [];
let page = 1;
const pageSize = 6;

// ---------- Views ----------
const $ = (s) => document.querySelector(s);
const $feedView = $("#feed-view");
const $postView = $("#post-view");

// ---------- Utilities ----------
const escapeHtml = (str) =>
  str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
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
        const res = await fetch('posts.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        allPosts = await res.json();
        filtered = [...allPosts];
    } catch (e) {
        console.error("Failed to load posts:", e);
        $feedView.innerHTML = `<p class=\"error\">Failed to load content. Please try again later.</p>`;
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
    const cats = p.categories.map(c => `<a href=\"#\" onclick=\"filterBy('${escapeHtml(c)}');return false;\">${escapeHtml(c)}</a>`).join(", ");
    
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
    const next = page < totalPages
        ? `<a class=\"page\" href=\"#\" onclick=\"gotoPage(${page+1});return false;\">Next »</a>`
        : "";

    $("#pager").innerHTML = pages.join("") + (next ? ` <span style=\"flex:1\"></span> ${next}` : "");
}

function renderPostDetail(id) {
    const post = allPosts.find(p => p.id === id);
    if (!post) {
        $postView.innerHTML = `<p class=\"error\">Post not found.</p><button onclick=\"routeTo('home');\">Back to list</button>`;
        return;
    }

    const { mon, day, year } = formatDateParts(post.date);
    const links = post.links.map(link => 
        `<li><a href=\"#\" class=\"btn-link\" target=\"_blank\">${escapeHtml(link.text)} <span aria-hidden=\"true\">→</span></a></li>`
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
                    ${links}
                </ul>
            </div>
        </article>
    `;
}

// ---------- Routing / Navigation ----------
function routeTo(route, params = {}){
    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const active = document.querySelector(`.nav a[data-route='${route === 'post' ? 'home' : route}']`);
    if(active) active.classList.add("active");

    if (route === 'post') {
        $feedView.style.display = 'none';
        $postView.style.display = 'block';
        renderPostDetail(params.id);
        window.scrollTo(0, 0);
    } else {
        $feedView.style.display = 'block';
        $postView.style.display = 'none';
        handleFeedRoute(route);
    }
}
window.routeTo = routeTo;

function handleFeedRoute(route) {
    if(route === "search"){
        $("#q").focus();
    } else if(route === "latest"){
        filtered = [...allPosts].sort((a,b) => b.date.localeCompare(a.date));
    } else { // home
        filtered = [...allPosts];
    }
    page = 1;
    renderFeed();
    window.scrollTo(0, 0);
}

function gotoPage(p){ 
    page = p; 
    renderFeed(); 
    window.scrollTo(0, 0); 
}
window.gotoPage = gotoPage;

// ---------- Init & Event Listeners ----------
async function init() {
    await loadData();
    renderFeed();
    // Other initial renders can go here if needed

    $("#q").addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        filtered = allPosts.filter(p => {
            const hay = [p.title, p.excerpt, ...(p.categories||[]), ...(p.tags||[])].join(" ").toLowerCase();
            return hay.includes(query);
        });
        page = 1;
        renderFeed();
    });
    
    // mobile nav toggle
    $("#burger").addEventListener("click", () => {
      $("#nav").classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", init);
