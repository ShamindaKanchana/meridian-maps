/**
 * RegionRenderer.js — Paints terrain regions, water bodies, and terrain labels.
 * Reads generic CountryModule data — knows nothing about Egypt specifically.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

// Default fill colors per region type (can be overridden per-region via region.color)
const TYPE_COLORS = {
  desert:   '#d4aa5a',
  fertile:  '#5aaa5a',
  forest:   '#2d7a2d',
  mountain: '#9e8b6e',
  urban:    '#c8b89a',
  water:    '#1e6bb5',
};

export default class RegionRenderer {

  /**
   * Paint terrain polygon regions onto the SVG group.
   * @param {SVGGElement} g
   * @param {Array} regions      from CountryModule.regions
   * @param {Projection} proj
   */
  static render(g, regions, proj) {
    regions.forEach(region => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', proj.pointsToPath(region.points, true));
      path.setAttribute('fill', region.color ?? TYPE_COLORS[region.type] ?? '#ccc');
      path.setAttribute('opacity', region.opacity ?? 1);
      path.setAttribute('data-region', region.name);
      g.appendChild(path);
    });
  }

  /**
   * Paint water bodies — seas as filled polygons, rivers as stroked polylines.
   * @param {SVGGElement} g
   * @param {Array} waterBodies  from CountryModule.waterBodies
   * @param {Projection} proj
   */
  static renderWater(g, waterBodies, proj) {
    waterBodies.forEach(wb => {
      if (wb.closed) {
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', proj.pointsToPath(wb.points, true));
        path.setAttribute('fill', wb.color ?? '#1e6bb5');
        path.setAttribute('opacity', wb.opacity ?? 0.85);
        path.setAttribute('data-water', wb.name);
        g.appendChild(path);
      } else {
        // River / canal — polyline with stroke only
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', proj.pointsToPath(wb.points, false));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', wb.color ?? '#1e6bb5');
        path.setAttribute('stroke-width', wb.type === 'river' ? '3' : '2');
        path.setAttribute('opacity', wb.opacity ?? 0.9);
        path.setAttribute('data-water', wb.name);
        g.appendChild(path);
      }
    });
  }

  /**
   * Render floating terrain labels (sea names, desert names etc.)
   * @param {SVGGElement} g
   * @param {Array} labels       from CountryModule.terrainLabels
   * @param {Projection} proj
   */
  static renderLabels(g, labels, proj) {
    labels.forEach(lbl => {
      const [x, y] = proj.toPixel(lbl.lon, lbl.lat);
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', lbl.fontSize ?? 11);
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', 'Segoe UI, sans-serif');
      text.setAttribute('letter-spacing', '2');
      text.setAttribute('opacity', lbl.opacity ?? 0.5);
      text.setAttribute('pointer-events', 'none');
      if (lbl.rotation) {
        text.setAttribute('transform', `rotate(${lbl.rotation},${x},${y})`);
      }
      text.textContent = lbl.text;
      g.appendChild(text);
    });
  }
}