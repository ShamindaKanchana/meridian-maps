import { describe, it, expect } from 'vitest';
import LandmarkRenderer from '../../core/LandmarkRenderer.js';
import Projection from '../../utils/projection.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

describe('LandmarkRenderer', () => {
  const proj = new Projection({ minLon: 0, maxLon: 10, minLat: 0, maxLat: 10 }, { width: 100, height: 100 });

  it('renders city markers with labels and temperature badges', () => {
    const g = document.createElementNS(SVG_NS, 'g');
    const cities = [
      { name: 'Cairo', lon: 5, lat: 5, population: 100, type: 'capital', monthlyTemps: [20, 21, 22] },
      { name: 'Town', lon: 2, lat: 8, population: 20, type: 'village', monthlyTemps: [10, 11, 12] },
    ];

    LandmarkRenderer.renderCities(g, cities, proj, 0);
    expect(g.children.length).toBe(2);
    expect(g.querySelector('[data-city="Cairo"]')).toBeTruthy();
    expect(g.querySelector('[data-city="Town"]')).toBeTruthy();
    expect(g.querySelector('[data-city="Cairo"] text').textContent).toContain('★');
  });

  it('renders landmark icons and allows registration of new icon types', () => {
    const g = document.createElementNS(SVG_NS, 'g');
    LandmarkRenderer.registerIcon('test', (group, sz) => {
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('data-test-icon', '1');
      group.appendChild(rect);
    });

    LandmarkRenderer.renderLandmarks(g, [{ name: 'Test', lon: 5, lat: 5, iconType: 'test', size: 10 }], proj);
    const group = g.querySelector('[data-landmark="Test"]');
    expect(group).toBeTruthy();
    expect(group.querySelector('[data-test-icon="1"]')).toBeTruthy();
  });
});
