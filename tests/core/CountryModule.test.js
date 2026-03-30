import { describe, it, expect } from 'vitest';
import CountryModule from '../../core/CountryModule.js';

class DummyModule extends CountryModule {
  get meta() { return { id: 'dummy', name: 'Dummy', flag: '🏳️', capital: 'Test', continent: 'Testland', description: 'desc' }; }
  get regions() { return []; }
  get cities() { return []; }
  get landmarks() { return []; }
  get waterBodies() { return []; }
  getBounds() { return { minLon: 0, maxLon: 1, minLat: 0, maxLat: 1 }; }
  getCanvasSize() { return { width: 100, height: 100 }; }
}

describe('CountryModule abstract base', () => {
  it('cannot be instantiated directly', () => {
    expect(() => new CountryModule()).toThrow('CountryModule is abstract');
  });

  it('allows subclassing with required members', () => {
    const module = new DummyModule();
    expect(module.meta.name).toBe('Dummy');
    expect(module.getBounds()).toEqual({ minLon: 0, maxLon: 1, minLat: 0, maxLat: 1 });
    expect(module.getCanvasSize()).toEqual({ width: 100, height: 100 });
  });
});
