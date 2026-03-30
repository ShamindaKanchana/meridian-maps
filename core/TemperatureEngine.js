/**
 * TemperatureEngine.js — Manages the month selector and temperature calculations.
 * Singleton — one instance per app. MapEngine calls refreshCities() on change.
 */
import { tempToColor } from '../utils/colorScale.js';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default class TemperatureEngine {

  /** @param {HTMLSelectElement} selectEl   The month <select> element in MapUI */
  constructor(selectEl, onChangeCallback) {
    this.selectEl  = selectEl;
    this.onChange  = onChangeCallback;   // () => MapEngine.refreshCities()
    this.currentMonth = new Date().getMonth();

    this._buildOptions();
    this.selectEl.value = this.currentMonth;
    this.selectEl.addEventListener('change', () => this._handleChange());
  }

  // ── Setup ──────────────────────────────────────────────────────────────────

  _buildOptions() {
    this.selectEl.innerHTML = '';
    MONTHS.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = m;
      this.selectEl.appendChild(opt);
    });
  }

  // ── Month change ───────────────────────────────────────────────────────────

  _handleChange() {
    this.currentMonth = parseInt(this.selectEl.value);
    this.onChange?.();
  }

  // ── Avg temperature display ────────────────────────────────────────────────

  /**
   * Compute and display the national average temperature for the current month.
   * @param {Array} cities         from CountryModule.cities
   * @param {HTMLElement} displayEl  the avg temp badge element
   */
  updateAvgDisplay(cities, displayEl) {
    if (!displayEl) return;
    const major = cities.filter(c => c.type === 'major' || c.type === 'capital');
    const temps = major.map(c => c.monthlyTemps[this.currentMonth]);
    const avg   = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const color = tempToColor(parseFloat(avg));
    displayEl.textContent = `🌡️ Avg: ${avg}°C`;
    displayEl.style.background = `linear-gradient(135deg, ${color}, #8B4513)`;
  }

  /** Current month name string. */
  get monthName() { return MONTHS[this.currentMonth]; }

  /** Static accessor so MapEngine can read currentMonth without a reference. */
  static currentMonth = new Date().getMonth();
}