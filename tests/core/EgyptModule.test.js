import { describe, it, expect } from 'vitest';
import EgyptModule from '../../modules/egypt/EgyptModule.js';

describe('EgyptModule', () => {
  const egypt = new EgyptModule();

  it('exposes valid metadata and bounds', () => {
    expect(egypt.meta.id).toBe('egypt');
    expect(egypt.meta.name).toBe('Egypt');
    expect(egypt.getBounds()).toEqual(egypt.meta.bounds);
    expect(egypt.getCanvasSize()).toEqual(egypt.meta.canvasSize);
  });

  it('returns expected data arrays', () => {
    expect(Array.isArray(egypt.regions)).toBe(true);
    expect(Array.isArray(egypt.cities)).toBe(true);
    expect(Array.isArray(egypt.landmarks)).toBe(true);
    expect(Array.isArray(egypt.waterBodies)).toBe(true);
    expect(Array.isArray(egypt.terrainLabels)).toBe(true);
  });

  it('supports lifecycle hooks without throwing', async () => {
    await expect(egypt.onLoad()).resolves.toBeUndefined();
    expect(() => egypt.onUnload()).not.toThrow();
  });

  it('accepts mergeApiData without throwing', () => {
    expect(() => egypt.mergeApiData({ cities: [], temperatures: [] })).not.toThrow();
  });
});
