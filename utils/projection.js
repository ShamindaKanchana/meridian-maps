/**
 * projection.js — lon/lat ↔ SVG pixel coordinate helpers.
 * A Projection instance is created by MapEngine from the active CountryModule's bounds.
 */
export default class Projection {

  /**
   * @param {{ minLon, maxLon, minLat, maxLat }} bounds
   * @param {{ width, height }} canvasSize
   */
  constructor(bounds, canvasSize) {
    this.bounds = bounds;
    this.W = canvasSize.width;
    this.H = canvasSize.height;
  }

  /** Geographic lon/lat → SVG pixel [x, y] */
  toPixel(lon, lat) {
    const { minLon, maxLon, minLat, maxLat } = this.bounds;
    const x = (lon - minLon) / (maxLon - minLon) * this.W;
    const y = (maxLat - lat) / (maxLat - minLat) * this.H;
    return [x, y];
  }

  /** SVG pixel [x, y] → geographic [lon, lat] */
  toGeo(x, y) {
    const { minLon, maxLon, minLat, maxLat } = this.bounds;
    const lon = (x / this.W) * (maxLon - minLon) + minLon;
    const lat = maxLat - (y / this.H) * (maxLat - minLat);
    return [lon, lat];
  }

  /** Convert an array of [lon, lat] pairs to an SVG path string (M / L / Z). */
  pointsToPath(points, close = true) {
    const d = points.map((p, i) => {
      const [x, y] = this.toPixel(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    return close ? d + ' Z' : d;
  }

  /** Convert an array of [lon, lat] pairs to a flat "x1,y1 x2,y2 …" string (for <polygon> / <polyline>). */
  pointsToSvgPoints(points) {
    return points.map(p => {
      const [x, y] = this.toPixel(p[0], p[1]);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  }
}