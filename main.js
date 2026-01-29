// ---------- Sample data (replace with CMS / API) ----------
    const posts = [
      {
        title: "Bingo Blitz +4 freebies",
        date: "2026-01-29",
        excerpt: "Collect daily gifts and bonus links. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Bingo Blitz", "Other Games"],
        tags: ["Bingo", "Coins", "Credits", "Freebies", "Gifts", "Slots"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/bingo-blitz-free-credits/",
      },
      {
        title: "Bingo Bash 16+ free chips",
        date: "2026-01-29",
        excerpt: "Daily chip drops via official promo links. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Bingo Bash", "Other Games"],
        tags: ["Bingo", "Chips", "Freebies", "Power Plays"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/bingo-bash-free-chips/",
      },
      {
        title: "House of Fun 3,000+ free coins",
        date: "2026-01-29",
        excerpt: "Stack coins for longer sessions. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["House of Fun Slots", "Slot Games"],
        tags: ["Coins", "Free", "Freebies", "Slots"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/house-of-fun-free-coins/",
      },
      {
        title: "DoubleU Slots 280,000+ free chips",
        date: "2026-01-29",
        excerpt: "Claim chips from rotating links. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["DoubleU Slots", "Slot Games"],
        tags: ["Chips", "Slots", "Freebies"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/doubleu-casino-free-chips/",
      },
      {
        title: "Jackpot Party 4k+ free coins",
        date: "2026-01-29",
        excerpt: "Promo drops updated frequently. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Jackpot Party", "Slot Games"],
        tags: ["Coins", "Slots", "Freebies"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/jackpot-party-casino-free-coins/",
      },
      {
        title: "Quick Hit 7,000+ free coins",
        date: "2026-01-29",
        excerpt: "Sample excerpt. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Quick Hit", "Slot Games"],
        tags: ["Coins", "Slots", "Freebies"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/quick-hit-casino-free-coins/",
      },
      {
        title: "Heart of Vegas 15,000+ free coins",
        date: "2026-01-28",
        excerpt: "More placeholder content. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Heart of Vegas", "Slot Games"],
        tags: ["Coins", "Freebies", "Slots"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/heart-of-vegas-free-coins/",
      },
      {
        title: "Wizard of Oz 1.5M+ free credits",
        date: "2026-01-28",
        excerpt: "Credits claim page stub. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Wizard of Oz", "Slot Games"],
        tags: ["Credits", "Freebies", "Slots"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/wizard-of-oz-slots-free-credits/",
      },
      {
        title: "Hit It Rich 400k+ free coins",
        date: "2026-01-27",
        excerpt: "Coins claim page stub. Redirects to the official freebies page on slotfreebies.com.",
        categories: ["Hit It Rich", "Slot Games"],
        tags: ["Coins", "Freebies", "Slots"],
        ctaText: "Collect Freebies",
        ctaHref: "https://slotfreebies.com/hit-it-rich-casino-slots-free-coins/",
      },
    ];

    const popular = [
      "Bingo Bash","Bingo Blitz","Caesars Slots","Cash Frenzy","Cashman Slots","DoubleDown Slots",
      "DoubleU Slots","Heart of Vegas","House of Fun","Jackpot Party","Quick Hit","Slotomania"
    ];

    const trending = [
      "Big Fish Slots","Club Vegas","Coin Master","GSN Slots","Jackpot World","Lotsa Slots",
      "Monopoly Go","My Konami Slots","Scatter Slots","UNO","Willy Wonka"
    ];

    // ---------- Utilities ----------
    const $ = (s) => document.querySelector(s);
    const escapeHtml = (str) =>
      str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
         .replaceAll('"',"&quot;").replaceAll("'","&#039;");

    function formatDateParts(iso){
      const d = new Date(iso + "T00:00:00");
      const mon = d.toLocaleString("en-US", { month:"short" });
      const day = String(d.getDate()).padStart(2,"0");
      const year = d.getFullYear();
      return { mon, day, year };
    }

    // ---------- Feed rendering + pagination ----------
    let page = 1;
    const pageSize = 6;
    let filtered = [...posts];

    function render(){
      // slice page
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      page = Math.min(page, totalPages);

      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      $("#countPill").textContent = `${total} posts`;

      $("#feed").innerHTML = items.map(p => {
        const { mon, day, year } = formatDateParts(p.date);
        const cats = p.categories.map(c => `<a href="#" onclick="filterBy('${escapeHtml(c)}');return false;">${escapeHtml(c)}</a>`).join(", ");
        const tags = p.tags.map(t => `<a class="tag" href="#" onclick="filterBy('${escapeHtml(t)}');return false;">${escapeHtml(t)}</a>`).join("");

        return `
          <article class="post">
            <div class="datebox" aria-label="Post date">
              <div class="mon">${escapeHtml(mon)}</div>
              <div class="day">${escapeHtml(day)}</div>
              <div class="year">${escapeHtml(String(year))}</div>
            </div>

            <div>
              <h2><a href="#" onclick="alert('Open post stub');return false;">${escapeHtml(p.title)}</a></h2>
              <p class="excerpt">${escapeHtml(p.excerpt)}</p>

              <div class="cta-row">
                <button class="btn" onclick="window.open('${p.ctaHref}', '_blank')">
                  ${escapeHtml(p.ctaText)} <span aria-hidden="true">→</span>
                </button>
                <div class="meta">
                  Posted in ${cats}
                </div>
              </div>

              <div class="tags" aria-label="Tags">
                ${tags}
              </div>
            </div>
          </article>
        `;
      }).join("");

      // pager
      const pages = [];
      for(let i=1;i<=totalPages;i++){
        pages.push(`<a class="page ${i===page?'active':''}" href="#" onclick="gotoPage(${i});return false;">${i}</a>`);
      }
      const next = page < totalPages
        ? `<a class="page" href="#" onclick="gotoPage(${page+1});return false;">Next »</a>`
        : "";

      $("#pager").innerHTML = pages.join("") + (next ? ` <span style="flex:1"></span> ${next}` : "");
    }

    function gotoPage(p){ page = p; render(); window.scrollTo(0, 0); }
    function filterBy(token){
      const t = token.toLowerCase();
      $("#q").value = token;
      applySearch(t);
    }

    function applySearch(q){
      const query = (q || "").trim().toLowerCase();
      filtered = posts.filter(p => {
        const hay = [
          p.title, p.excerpt,
          ...(p.categories||[]),
          ...(p.tags||[])
        ].join(" ").toLowerCase();
        return hay.includes(query);
      });
      page = 1;
      render();
      hydrateFooter();
    }

    // ---------- Sidebar lists ----------
    function renderSidebar(){
      $("#popularList").innerHTML = popular.map(name =>
        `<li><a href="#" onclick="filterBy('${escapeHtml(name)}');return false;">${escapeHtml(name)} <span>↗</span></a></li>`
      ).join("");

      $("#trendingList").innerHTML = trending.map(name =>
        `<li><a href="#" onclick="filterBy('${escapeHtml(name)}');return false;">${escapeHtml(name)} <span>↗</span></a></li>`
      ).join("");
    }

    // ---------- Footer hydration ----------
    function hydrateFooter(){
      const topPopular = popular.slice(0,7).map(n => `<a href="#" onclick="filterBy('${escapeHtml(n)}');return false;">${escapeHtml(n)}</a>`).join("");
      $("#footerPopular").innerHTML = topPopular;

      const latest = [...posts]
        .sort((a,b) => b.date.localeCompare(a.date))
        .slice(0,7)
        .map(p => `<a href="#" onclick="window.open('${p.ctaHref}', '_blank');return false;">${escapeHtml(p.title)}</a>`)
        .join("");

      $("#footerLatest").innerHTML = latest;
    }

    // ---------- Simple route stubs ----------
    function routeTo(route){
      // In real project: swap templates / fetch by route / change URL
      document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
      const active = document.querySelector(`.nav a[data-route="${route}"]`);
      if(active) active.classList.add("active");

      if(route === "search"){
        $("#q").focus();
      } else if(route === "latest"){
        // sort by date desc
        filtered = [...posts].sort((a,b) => b.date.localeCompare(a.date));
        page = 1;
        $("#q").value = "";
        render();
        hydrateFooter();
      } else if(route === "games"){
        alert("Games page stub. Implement taxonomy grid here.");
      } else if(route === "about"){
        alert("About page stub.");
      } else if(route === "cookie"){
        alert("Cookie policy stub.");
      } else {
        // home: default ordering (as-is)
        filtered = [...posts];
        page = 1;
        $("#q").value = "";
        render();
        hydrateFooter();
      }
    }
    window.routeTo = routeTo;

    // ---------- Init ----------
    document.addEventListener("DOMContentLoaded", () => {
      $("#year").textContent = new Date().getFullYear();

      renderSidebar();
      hydrateFooter();
      render();

      $("#q").addEventListener("input", (e) => applySearch(e.target.value));

      // mobile nav toggle
      $("#burger").addEventListener("click", () => {
        $("#nav").classList.toggle("open");
      });

      // nav route clicks
      document.querySelectorAll(".nav a").forEach(a => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          routeTo(a.dataset.route);
        });
      });
    });
