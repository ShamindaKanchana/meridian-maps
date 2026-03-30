import { describe, it, expect } from 'vitest';
import Projection from '../../utils/projection.js';

describe('Projection', () => {
  const bounds = { minLon: 0, maxLon: 10, minLat: 0, maxLat: 10 };
  const canvas = { width: 100, height: 100 };
  const proj = new Projection(bounds, canvas);

  it('converts geo to pixel coordinates and back', () => {
    const [x, y] = proj.toPixel(10, 0);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(100);

    const [lon, lat] = proj.toGeo(x, y);
    expect(lon).toBeCloseTo(10);
    expect(lat).toBeCloseTo(0);
  });

  it('creates SVG path strings from points', () => {
    const points = [[0, 10], [10, 10], [10, 0]];
    const path = proj.pointsToPath(points);
    expect(path).toContain('M0.00,0.00');
    expect(path).toContain('L100.00,0.00');
    expect(path).toContain('L100.00,100.00');
    expect(path.endsWith(' Z')).toBe(true);
  });

  it('creates SVG point lists from points', () => {
    const points = [[0, 10], [10, 0]];
    expect(proj.pointsToSvgPoints(points)).toBe('0.00,0.00 100.00,100.00');
  });
});
