/**
 * colorScale.js — Maps a numeric value to a color.
 * Used by TemperatureEngine to color city markers and badges.
 * Scales are reusable — temperature, population density, elevation, etc.
 */

/** Default temperature color stops (°C) */
const TEMP_STOPS = [
  { val: -10, color: '#a0c8f0' }, // deep cold — icy blue
  { val:   0, color: '#6ec6f5' }, // cold — light blue
  { val:  10, color: '#a8e0a0' }, // cool — green
  { val:  15, color: '#d4e87a' }, // mild — yellow-green
  { val:  20, color: '#f5e44a' }, // warm — yellow
  { val:  25, color: '#f5a623' }, // hot — orange
  { val:  30, color: '#f56b23' }, // very hot — deep orange
  { val:  35, color: '#d42b2b' }, // extreme — red
  { val:  45, color: '#7a0000' }, // deadly — dark red
];

/**
 * Linearly interpolate between two hex colors.
 * @param {string} c1 hex e.g. '#ff0000'
 * @param {string} c2 hex
 * @param {number} t  0–1
 * @returns {string} hex
 */
function lerpColor(c1, c2, t) {
  const parse = h => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(c1);
  const [r2, g2, b2] = parse(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Map a value to a color using a custom stop array.
 * @param {number} val
 * @param {Array<{val: number, color: string}>} stops  sorted ascending by val
 * @returns {string} hex color
 */
export function valueToColor(val, stops = TEMP_STOPS) {
  if (val <= stops[0].val) return stops[0].color;
  if (val >= stops[stops.length - 1].val) return stops[stops.length - 1].color;
  for (let i = 0; i < stops.length - 1; i++) {
    if (val >= stops[i].val && val <= stops[i + 1].val) {
      const t = (val - stops[i].val) / (stops[i + 1].val - stops[i].val);
      return lerpColor(stops[i].color, stops[i + 1].color, t);
    }
  }
  return stops[0].color;
}

/** Convenience: temperature-specific shorthand */
export function tempToColor(celsius) {
  return valueToColor(celsius, TEMP_STOPS);
}

/** Population → radius (px). Pass maxPop of the dataset for relative scaling. */
export function popToRadius(population, maxPop, { minR = 3, maxR = 14 } = {}) {
  return minR + (population / maxPop) * (maxR - minR);
}