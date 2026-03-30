/**
 * Tooltip.js — Reusable hover tooltip component.
 * Attach to any container. Call show(content, x, y) / hide().
 */
export default class Tooltip {

  /** @param {HTMLElement} container  Tooltip is appended inside this element */
  constructor(container) {
    this.container = container;
    this.el = document.createElement('div');
    this.el.className = 'geo-tooltip';
    this.el.style.cssText = `
      position: absolute;
      background: rgba(20,8,0,0.95);
      border: 1px solid #D4A017;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.82em;
      pointer-events: none;
      display: none;
      z-index: 200;
      max-width: 210px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6);
      font-family: Segoe UI, sans-serif;
      color: #f5e6c8;
    `;
    container.appendChild(this.el);
  }

  /**
   * Show tooltip with HTML content near a mouse event.
   * @param {string} html
   * @param {MouseEvent} e
   */
  showAt(html, e) {
    this.el.innerHTML = html;
    this.el.style.display = 'block';
    this.move(e);
  }

  /** Move tooltip to follow the mouse. */
  move(e) {
    const rect = this.container.getBoundingClientRect();
    let x = e.clientX - rect.left + 12;
    let y = e.clientY - rect.top  - 10;
    if (x + 220 > rect.width)  x -= 230;
    if (y + 160 > rect.height) y -= 170;
    this.el.style.left = `${x}px`;
    this.el.style.top  = `${y}px`;
  }

  hide() {
    this.el.style.display = 'none';
  }

  // ── Content builders ───────────────────────────────────────────────────────

  static cityHtml(city, temp, tempColor, monthName) {
    const typeIcon = { capital:'🏛️', major:'🏙️', town:'🏘️', village:'🏡' };
    const minT = Math.min(...city.monthlyTemps);
    const maxT = Math.max(...city.monthlyTemps);
    return `
      <div style="font-weight:bold;color:#D4A017;font-size:1em;margin-bottom:4px">
        📍 ${city.name}
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;margin:2px 0">
        <span>Population</span><span>${city.population.toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;margin:2px 0">
        <span>Temp (${monthName})</span>
        <span style="color:${tempColor};font-weight:bold">${temp}°C</span>
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;margin:2px 0">
        <span>Annual range</span><span>${minT}° – ${maxT}°C</span>
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;margin:2px 0">
        <span>Type</span><span>${typeIcon[city.type] ?? ''} ${city.type}</span>
      </div>
    `;
  }

  static landmarkHtml(landmark) {
    return `
      <div style="font-weight:bold;color:#D4A017;font-size:1em;margin-bottom:4px">
        🔺 ${landmark.name}
      </div>
      <div style="margin:2px 0;opacity:0.85;font-size:0.95em">${landmark.description}</div>
      ${landmark.size ? `
      <div style="display:flex;justify-content:space-between;gap:10px;margin:4px 0">
        <span>Size</span><span>${landmark.size}m</span>
      </div>` : ''}
    `;
  }
}