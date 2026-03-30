/**
 * CountryCard.js — A single selectable card in the HomeUI grid.
 * Renders flag, name, capital, continent, and description.
 */
export default class CountryCard {

  /**
   * @param {object} meta         CountryModule.meta
   * @param {Function} onClick    called with meta.id when card is clicked
   */
  constructor(meta, onClick) {
    this.meta    = meta;
    this.onClick = onClick;
    this.el      = this._build();
  }

  _build() {
    const card = document.createElement('div');
    card.className   = 'country-card';
    card.dataset.id  = this.meta.id;
    card.innerHTML   = `
      <div class="card-flag">${this.meta.flag}</div>
      <div class="card-body">
        <div class="card-name">${this.meta.name}</div>
        <div class="card-sub">${this.meta.capital} · ${this.meta.continent}</div>
        <div class="card-desc">${this.meta.description}</div>
      </div>
      <div class="card-arrow">›</div>
    `;
    card.addEventListener('click', () => this.onClick(this.meta.id));
    return card;
  }

  /** Append the card into a parent element. */
  mount(parent) {
    parent.appendChild(this.el);
  }

  /** Highlight this card as selected. */
  setActive(active) {
    this.el.classList.toggle('active', active);
  }
}