/**
 * LandmarkRenderer.js — Renders cities and landmark icons onto the SVG.
 * Tooltip instance is passed in so hover events can call showAt/hide directly.
 */
import { tempToColor, popToRadius } from '../utils/colorScale.js';
import Tooltip from '../ui/Tooltip.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const ICON_REGISTRY = {

  pyramid(g, sz) {
    _el('ellipse', { cx:0, cy:sz*0.15, rx:sz*0.8, ry:sz*0.18, fill:'rgba(0,0,0,0.25)' }, g);
    _el('polygon', { points:`0,${-sz} ${sz*0.75},${sz*0.1} ${-sz*0.75},${sz*0.1}`,
      fill:'#d4a855', stroke:'#8B6914', 'stroke-width':'0.8' }, g);
    _el('polygon', { points:`0,${-sz} ${sz*0.75},${sz*0.1} 0,${sz*0.1}`,
      fill:'rgba(0,0,0,0.18)' }, g);
    _el('polygon', { points:`0,${-sz} ${-sz*0.75},${sz*0.1} 0,${sz*0.1}`,
      fill:'rgba(255,255,255,0.08)' }, g);
    _el('circle', { cx:0, cy:-sz, r:sz*0.1, fill:'#ffe066', opacity:'0.7' }, g);
  },

  temple(g, sz) {
    const w = sz*1.4, h = sz*1.0, col = '#c8a96e';
    _el('rect', { x:-w/2, y:sz*0.1, width:w, height:sz*0.25, fill:'#a07840', rx:'1' }, g);
    _el('rect', { x:-w/2+sz*0.1, y:-h*0.4, width:w-sz*0.2, height:h*0.5,
      fill:col, stroke:'#8B6914', 'stroke-width':'0.5' }, g);
    [-w/2+sz*0.2, 0, w/2-sz*0.2].forEach(cx => {
      _el('rect', { x:cx-sz*0.07, y:-h*0.4, width:sz*0.14, height:h*0.5, fill:'#e8c87a' }, g);
    });
    _el('polygon', { points:`${-w/2},${-h*0.4} ${w/2},${-h*0.4} 0,${-h*0.4-sz*0.5}`,
      fill:'#b8922a', stroke:'#8B6914', 'stroke-width':'0.5' }, g);
  },

  monument(g, sz) {
    const w = sz*0.35;
    _el('polygon', { points:`0,${-sz} ${-w/2},${sz*0.1} ${w/2},${sz*0.1}`,
      fill:'#e8d09a', stroke:'#a09060', 'stroke-width':'0.6' }, g);
    _el('polygon', { points:`0,${-sz} ${-w*0.1},${-sz+sz*0.15} ${w*0.1},${-sz+sz*0.15}`,
      fill:'#ffe066', opacity:'0.8' }, g);
  },

  castle(g, sz) {
    const w = sz*1.2, h = sz*0.9, col = '#9e8b6e';
    _el('rect', { x:-w/2, y:-h, width:w, height:h, fill:col,
      stroke:'#6e5b4e', 'stroke-width':'0.6' }, g);
    [-w/2, -w/6, w/6-sz*0.2, w/2-sz*0.4].forEach(bx => {
      _el('rect', { x:bx, y:-h-sz*0.3, width:sz*0.3, height:sz*0.3,
        fill:col, stroke:'#6e5b4e', 'stroke-width':'0.5' }, g);
    });
    _el('rect', { x:-sz*0.18, y:-h*0.5, width:sz*0.36, height:h*0.5,
      fill:'#3a2a1a', rx:'2' }, g);
  },

  volcano(g, sz) {
    _el('polygon', { points:`0,${-sz} ${sz*0.9},${sz*0.15} ${-sz*0.9},${sz*0.15}`,
      fill:'#7a4a2a', stroke:'#4a2a0a', 'stroke-width':'0.8' }, g);
    _el('polygon', { points:`0,${-sz} ${-sz*0.2},${-sz+sz*0.3} ${sz*0.2},${-sz+sz*0.3}`,
      fill:'#ff6600', opacity:'0.85' }, g);
    _el('circle', { cx:0, cy:-sz, r:sz*0.12, fill:'#ff3300', opacity:'0.9' }, g);
  },
};

export default class LandmarkRenderer {

  /**
   * @param {SVGGElement} g
   * @param {Array}       cities
   * @param {Projection}  proj
   * @param {number}      monthIndex  0–11
   * @param {Tooltip}     tooltip
   * @param {string}      monthName   e.g. "July"
   */
  static renderCities(g, cities, proj, monthIndex, tooltip, monthName) {
    const maxPop = Math.max(...cities.map(c => c.population));

    cities.forEach(c => {
      const [cx, cy] = proj.toPixel(c.lon, c.lat);
      const temp  = c.monthlyTemps[monthIndex];
      const tc    = tempToColor(temp);
      const r     = popToRadius(c.population, maxPop, { minR:3, maxR:14 });
      const isCapital = c.type === 'capital';
      const isMajor   = c.type === 'major' || isCapital;

      const grp = _group({
        transform: `translate(${cx},${cy})`,
        style: 'cursor:pointer',
        'data-city': c.name,
      }, g);

      if (isMajor) {
        _el('circle', { cx:0, cy:0, r:r+6, fill:tc, opacity:'0.15' }, grp);
        _el('circle', { cx:0, cy:0, r:r+3, fill:tc, opacity:'0.3'  }, grp);
      }

      _el('circle', { cx:0, cy:0, r,
        fill: isCapital ? '#ff2222' : isMajor ? '#ff5555' : '#ffaa00',
        stroke:'#fff', 'stroke-width': isMajor ? '1.5' : '1',
      }, grp);

      if (isCapital) {
        _el('text', { x:0, y:4, 'text-anchor':'middle', 'font-size':'8',
          fill:'#fff', 'pointer-events':'none' }, grp).textContent = '★';
      }

      _el('text', { x:r+4, y:4, fill:'#fff',
        'font-size': isMajor ? '9' : '7.5',
        'font-weight': isMajor ? 'bold' : 'normal',
        'pointer-events':'none',
      }, grp).textContent = c.name;

      _el('text', { x:0, y:-r-3, fill:tc, 'font-size':'7',
        'text-anchor':'middle', 'font-weight':'bold',
        'pointer-events':'none',
      }, grp).textContent = `${temp}°`;

      // ── Tooltip events ────────────────────────────────────────────
      if (tooltip) {
        grp.addEventListener('mouseenter', e =>
          tooltip.showAt(Tooltip.cityHtml(c, temp, tc, monthName), e));
        grp.addEventListener('mousemove',  e => tooltip.move(e));
        grp.addEventListener('mouseleave', () => tooltip.hide());
      }
    });
  }

  /**
   * @param {SVGGElement} g
   * @param {Array}       landmarks
   * @param {Projection}  proj
   * @param {Tooltip}     tooltip
   */
  static renderLandmarks(g, landmarks, proj, tooltip) {
    const maxSize = Math.max(...landmarks.map(l => l.size));

    landmarks.forEach(lm => {
      const [cx, cy] = proj.toPixel(lm.lon, lm.lat);
      const sz = 4 + (lm.size / maxSize) * 14;

      const grp = _group({
        transform: `translate(${cx},${cy})`,
        style: 'cursor:pointer',
        'data-landmark': lm.name,
      }, g);

      const drawFn = ICON_REGISTRY[lm.iconType] ?? ICON_REGISTRY.monument;
      drawFn(grp, sz);

      // ── Tooltip events ────────────────────────────────────────────
      if (tooltip) {
        grp.addEventListener('mouseenter', e =>
          tooltip.showAt(Tooltip.landmarkHtml(lm), e));
        grp.addEventListener('mousemove',  e => tooltip.move(e));
        grp.addEventListener('mouseleave', () => tooltip.hide());
      }
    });
  }

  static registerIcon(type, drawFn) {
    ICON_REGISTRY[type] = drawFn;
  }
}

function _el(tag, attrs, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

function _group(attrs, parent) {
  return _el('g', attrs, parent);
}