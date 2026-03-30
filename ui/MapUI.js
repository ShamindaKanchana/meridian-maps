/**
 * MapUI.js — Map shell: toolbar, month dropdown, legend, compass, back button.
 * Wires together MapEngine + TemperatureEngine for a mounted country module.
 */
import MapEngine         from '../core/MapEngine.js';
import TemperatureEngine from '../core/TemperatureEngine.js';
import Tooltip           from './Tooltip.js';
import { tempToColor }   from '../utils/colorScale.js';

export default class MapUI {

  /**
   * @param {HTMLElement} container   Full-screen map shell container
   * @param {Function} onBack         Called when user clicks ‹ Back
   */
  constructor(container, onBack) {
    this.container = container;
    this.onBack    = onBack;
    this.engine    = null;
    this.tempEng   = null;
    this.tooltip   = null;
    this.module    = null;
    this._build();
  }

  // ── DOM scaffold ───────────────────────────────────────────────────────────

  _build() {
    this.container.innerHTML = `
      <div class="map-header" id="map-header">
        <button class="map-back-btn" id="map-back">‹ Countries</button>
        <span class="map-country-title" id="map-country-title"></span>
        <div class="map-controls">
          <label class="map-month-label">📅</label>
          <select id="month-select" class="map-month-select"></select>
          <div id="avg-temp-badge" class="map-avg-temp">🌡️ --°C</div>
        </div>
      </div>

      <div class="map-body" id="map-body">
        <!-- SVG injected here by MapEngine -->

        <div class="map-zoom-btns">
          <button class="map-zbtn" id="btn-zin">+</button>
          <button class="map-zbtn" id="btn-zout">−</button>
          <button class="map-zbtn" id="btn-reset" title="Reset">⌂</button>
          <button class="map-zbtn" id="btn-rotL" title="Rotate left">↺</button>
          <button class="map-zbtn" id="btn-rotR" title="Rotate right">↻</button>
        </div>

        <svg id="compass-svg" class="map-compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="rgba(20,8,0,0.7)" stroke="#D4A017" stroke-width="1.5"/>
          <g id="compass-rotate-group">
            <polygon points="30,6 34,30 30,26 26,30" fill="#ff4444"/>
            <polygon points="30,54 34,30 30,34 26,30" fill="#ccc"/>
            <text x="30" y="13" text-anchor="middle" fill="#ff4444" font-size="8" font-weight="bold">N</text>
            <text x="30" y="52" text-anchor="middle" fill="#ccc" font-size="7">S</text>
            <text x="8"  y="33" text-anchor="middle" fill="#ccc" font-size="7">W</text>
            <text x="52" y="33" text-anchor="middle" fill="#ccc" font-size="7">E</text>
          </g>
        </svg>

        <div class="map-legend" id="map-legend"></div>
      </div>
    `;

    this._wireButtons();
  }

  _wireButtons() {
    this.container.querySelector('#map-back')
      .addEventListener('click', () => this.onBack());
    this.container.querySelector('#btn-zin')
      .addEventListener('click', () => this.engine?.zoomIn());
    this.container.querySelector('#btn-zout')
      .addEventListener('click', () => this.engine?.zoomOut());
    this.container.querySelector('#btn-reset')
      .addEventListener('click', () => this.engine?.reset());
    this.container.querySelector('#btn-rotL')
      .addEventListener('click', () => this.engine?.rotateLeft());
    this.container.querySelector('#btn-rotR')
      .addEventListener('click', () => this.engine?.rotateRight());
  }

  // ── Mount a country module ─────────────────────────────────────────────────

  async mount(module) {
    this.module = module;
    const mapBody = this.container.querySelector('#map-body');

    // Title
    this.container.querySelector('#map-country-title').textContent =
      `${module.meta.flag}  ${module.meta.name}`;

    // Tooltip
    this.tooltip = new Tooltip(mapBody);

    // Temperature engine
    const monthSel  = this.container.querySelector('#month-select');
    const avgBadge  = this.container.querySelector('#avg-temp-badge');
    this.tempEng = new TemperatureEngine(monthSel, () => {
      TemperatureEngine.currentMonth = this.tempEng.currentMonth;
      this.engine?.refreshCities();
      this.tempEng.updateAvgDisplay(module.cities, avgBadge);
    });
    this.tempEng.updateAvgDisplay(module.cities, avgBadge);

    // Map engine — pass tooltip so renderers can wire hover events
    const compassEl = this.container.querySelector('#compass-svg');
    this.engine = new MapEngine(mapBody, compassEl, this.tooltip);
    await this.engine.mount(module);

    // Legend
    this._buildLegend(module);
  }

  unmount() {
    this.engine?.unmount();
    this.engine   = null;
    this.tempEng  = null;
    this.module   = null;
  }

  // ── Legend ─────────────────────────────────────────────────────────────────

  _buildLegend(module) {
    const leg = this.container.querySelector('#map-legend');
    const iconTypes = [...new Set(module.landmarks.map(l => l.iconType))];

    // SVG icon per landmark type — matches LandmarkRenderer shapes
    const iconSvg = {
      pyramid: `<svg width="16" height="14" viewBox="0 0 16 14">
        <polygon points="8,1 15,13 1,13" fill="#d4a855" stroke="#8B6914" stroke-width="0.8"/>
        <polygon points="8,1 15,13 8,13" fill="rgba(0,0,0,0.18)"/>
      </svg>`,
      temple: `<svg width="16" height="14" viewBox="0 0 16 14">
        <rect x="1" y="10" width="14" height="3" fill="#a07840" rx="1"/>
        <rect x="2" y="5" width="12" height="5" fill="#c8a96e" stroke="#8B6914" stroke-width="0.5"/>
        <polygon points="2,5 14,5 8,1" fill="#b8922a" stroke="#8B6914" stroke-width="0.5"/>
        <rect x="4" y="5" width="2" height="5" fill="#e8c87a"/>
        <rect x="7" y="5" width="2" height="5" fill="#e8c87a"/>
        <rect x="10" y="5" width="2" height="5" fill="#e8c87a"/>
      </svg>`,
      monument: `<svg width="16" height="14" viewBox="0 0 16 14">
        <polygon points="8,1 10.5,13 5.5,13" fill="#e8d09a" stroke="#a09060" stroke-width="0.6"/>
        <polygon points="8,1 7,3.5 9,3.5" fill="#ffe066" opacity="0.9"/>
      </svg>`,
      castle: `<svg width="16" height="14" viewBox="0 0 16 14">
        <rect x="2" y="5" width="12" height="8" fill="#9e8b6e" stroke="#6e5b4e" stroke-width="0.6"/>
        <rect x="2" y="2" width="2.5" height="3" fill="#9e8b6e" stroke="#6e5b4e" stroke-width="0.5"/>
        <rect x="6" y="2" width="2.5" height="3" fill="#9e8b6e" stroke="#6e5b4e" stroke-width="0.5"/>
        <rect x="10" y="2" width="2.5" height="3" fill="#9e8b6e" stroke="#6e5b4e" stroke-width="0.5"/>
        <rect x="6" y="9" width="4" height="4" fill="#3a2a1a" rx="1"/>
      </svg>`,
      volcano: `<svg width="16" height="14" viewBox="0 0 16 14">
        <polygon points="8,1 15,13 1,13" fill="#7a4a2a" stroke="#4a2a0a" stroke-width="0.8"/>
        <polygon points="8,1 6,4.5 10,4.5" fill="#ff6600" opacity="0.85"/>
        <circle cx="8" cy="1.5" r="1.5" fill="#ff3300" opacity="0.9"/>
      </svg>`,
    };

    leg.innerHTML = `
      <div class="leg-item">
        <span class="leg-dot" style="background:#ff4444;border:2px solid #fff"></span> Capital
      </div>
      <div class="leg-item">
        <span class="leg-dot" style="background:#ff5555;border:2px solid #fff"></span> Major city
      </div>
      <div class="leg-item">
        <span class="leg-dot" style="background:#ffaa00;border:2px solid #fff"></span> Town
      </div>
      ${iconTypes.map(t => `
      <div class="leg-item">
        ${iconSvg[t] ?? iconSvg.monument}
        ${t.charAt(0).toUpperCase() + t.slice(1)}
      </div>`).join('')}
    `;
  }

  show() { this.container.style.display = ''; }
  hide() { this.container.style.display = 'none'; }
}