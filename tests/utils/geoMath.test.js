import { describe, it, expect } from 'vitest';
import { clamp, lerp, toRad, toDeg, haversineKm, clampTransform, zoomAt, buildTransform } from '../../utils/geoMath.js';

describe('geoMath utilities', () => {
  it('clamps values within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
  });

  it('lerps between values', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(5, 15, 0.25)).toBe(7.5);
  });

  it('converts degrees and radians', () => {
    expect(toRad(180)).toBeCloseTo(Math.PI);
    expect(toDeg(Math.PI / 2)).toBeCloseTo(90);
  });

  it('calculates haversine distance', () => {
    const dist = haversineKm(0, 0, 0, 1);
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(112);
  });

  it('clamps transform state for viewport constraints', () => {
    const transform = clampTransform({ tx: 100, ty: 100, scale: 0.1 }, { W: 100, H: 100 }, { width: 200, height: 200 });
    expect(transform.scale).toBeGreaterThanOrEqual(1);
    expect(transform.tx).toBeLessThanOrEqual(0);
    expect(transform.ty).toBeLessThanOrEqual(0);
  });

  it('zooms at a focal point correctly', () => {
    const result = zoomAt({ tx: 0, ty: 0, scale: 1 }, 2, 50, 50);
    expect(result.scale).toBe(2);
    expect(result.tx).toBe(50 - (50 - 0) * 2);
    expect(result.ty).toBe(50 - (50 - 0) * 2);
  });

  it('builds a CSS transform string', () => {
    expect(buildTransform({ tx: 5, ty: 10, scale: 1.5, rotation: 30, cx: 20, cy: 30 }))
      .toBe('translate(5,10) scale(1.5) rotate(30,20,30)');
  });
});
