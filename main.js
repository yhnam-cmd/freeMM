document.addEventListener('DOMContentLoaded', () => {

  const mockGames = [
    { id: 1, name: 'Cosmic Reels', category: 'newest', imageUrl: 'https://picsum.photos/seed/cosmic/300/200' },
    { id: 2, name: 'Galaxy Gems', category: 'popular', imageUrl: 'https://picsum.photos/seed/galaxy/300/200' },
    { id: 3, name: 'Starburst Spin', category: 'newest', imageUrl: 'https://picsum.photos/seed/starburst/300/200' },
    { id: 4, name: 'Neon Nights', category: 'popular', imageUrl: 'https://picsum.photos/seed/neon/300/200' },
    { id: 5, name: 'Jackpot Jupiter', category: 'all', imageUrl: 'https://picsum.photos/seed/jupiter/300/200' },
    { id: 6, name: 'Vegas Vortex', category: 'newest', imageUrl: 'https://picsum.photos/seed/vegas/300/200' },
    { id: 7, name: 'Pirate's Plunder', category: 'popular', imageUrl: 'https://picsum.photos/seed/pirate/300/200' },
    { id: 8, name: 'Aztec Adventure', category: 'all', imageUrl: 'https://picsum.photos/seed/aztec/300/200' },
  ];

  class GameCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const name = this.getAttribute('name');
      const imageUrl = this.getAttribute('image-url');

      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          .card {
            background-color: var(--card-background, #2a1a4a);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4), 0 0 15px rgba(255, 0, 255, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 30px rgba(0,0,0,0.6), 0 0 25px var(--primary-glow, #ff00ff);
          }
          img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
          }
          .title-container {
            padding: 1rem;
            text-align: center;
            font-weight: bold;
            font-size: 1.1rem;
          }
        </style>
        <div class="card">
          <img src="${imageUrl}" alt="${name}">
          <div class="title-container"><span>${name}</span></div>
        </div>
      `;
    }
  }

  if (!customElements.get('game-card')) {
    customElements.define('game-card', GameCard);
  }

  const mainContainer = document.querySelector('.site-main');
  const searchInput = document.getElementById('search-input');
  const navButtons = document.querySelectorAll('.nav-button');

  let currentFilter = 'all';
  let searchTerm = '';

  const renderGames = () => {
    mainContainer.innerHTML = ''; 

    let filteredGames = mockGames.filter(game => {
      const matchesFilter = currentFilter === 'all' || game.category === currentFilter;
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filteredGames.forEach((game, index) => {
      // Insert an ad slot after every 4th game
      if (index > 0 && index % 4 === 0) {
        const adPlaceholder = document.createElement('div');
        adPlaceholder.className = 'ad-placeholder';
        adPlaceholder.textContent = 'Ad Slot';
        mainContainer.appendChild(adPlaceholder);
      }

      const gameCard = document.createElement('game-card');
      gameCard.setAttribute('name', game.name);
      gameCard.setAttribute('image-url', game.imageUrl);
      mainContainer.appendChild(gameCard);
    });
  };

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderGames();
  });

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      renderGames();
    });
  });

  // Initial render
  renderGames();
});
