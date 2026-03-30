/**
 * HomeUI.js — Country selector landing page.
 * Renders a grid of CountryCards. On selection, calls onSelect(moduleId).
 */
import CountryCard from './CountryCard.js';

export default class HomeUI {

  /**
   * @param {HTMLElement} container
   * @param {Map<string, CountryModule>} registry   moduleId → module instance
   * @param {Function} onSelect                     (moduleId) => void
   */
  constructor(container, registry, onSelect) {
    this.container = container;
    this.registry  = registry;
    this.onSelect  = onSelect;
    this.cards     = new Map();
    this._build();
  }

  _build() {
    this.container.innerHTML = `
      <div class="home-header">
        <div class="home-logo">🌍</div>
        <h1 class="home-title">Meridian Maps</h1>
        <p class="home-subtitle">Choose a country to explore</p>
      </div>
      <div class="home-search-wrap">
        <input class="home-search" type="text" placeholder="Search country…" />
      </div>
      <div class="home-grid" id="country-grid"></div>
    `;

    const grid = this.container.querySelector('#country-grid');
    this.registry.forEach((module, id) => {
      const card = new CountryCard(module.meta, (selectedId) => {
        this._setActive(selectedId);
        this.onSelect(selectedId);
      });
      card.mount(grid);
      this.cards.set(id, card);
    });

    // Search filter
    this.container.querySelector('.home-search')
      .addEventListener('input', e => this._filter(e.target.value));
  }

  _filter(query) {
    const q = query.toLowerCase();
    this.cards.forEach((card, id) => {
      const meta = this.registry.get(id).meta;
      const match = meta.name.toLowerCase().includes(q)
        || meta.capital.toLowerCase().includes(q)
        || meta.continent.toLowerCase().includes(q);
      card.el.style.display = match ? '' : 'none';
    });
  }

  _setActive(id) {
    this.cards.forEach((card, cid) => card.setActive(cid === id));
  }

  show() { this.container.style.display = ''; }
  hide() { this.container.style.display = 'none'; }
}