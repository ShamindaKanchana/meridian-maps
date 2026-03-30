import { describe, it, expect } from 'vitest';
import RegionRenderer from '../../core/RegionRenderer.js';
import Projection from '../../utils/projection.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

describe('RegionRenderer', () => {
  const proj = new Projection({ minLon: 0, maxLon: 10, minLat: 0, maxLat: 10 }, { width: 100, height: 100 });

  it('renders terrain regions as SVG paths', () => {
    const g = document.createElementNS(SVG_NS, 'g');
    const regions = [{ name: 'Desert', type: 'desert', points: [[0, 10], [10, 10], [10, 0]], opacity: 0.7 }];
    RegionRenderer.render(g, regions, proj);

    expect(g.children.length).toBe(1);
    const path = g.children[0];
    expect(path.getAttribute('data-region')).toBe('Desert');
    expect(path.getAttribute('opacity')).toBe('0.7');
  });

  it('renders water bodies as filled polygons or stroked rivers', () => {
    const g = document.createElementNS(SVG_NS, 'g');
    const waterBodies = [
      { name: 'Sea', type: 'sea', color: '#123456', opacity: 0.5, closed: true, points: [[0, 10], [10, 10], [10, 0]] },
      { name: 'Nile', type: 'river', color: '#654321', opacity: 0.8, closed: false, points: [[0, 10], [10, 0]] },
    ];
    RegionRenderer.renderWater(g, waterBodies, proj);

    expect(g.children.length).toBe(2);
    expect(g.children[0].getAttribute('fill')).toBe('#123456');
    expect(g.children[1].getAttribute('stroke')).toBe('#654321');
    expect(g.children[1].getAttribute('fill')).toBe('none');
  });

  it('renders terrain labels with position and optional rotation', () => {
    const g = document.createElementNS(SVG_NS, 'g');
    const labels = [{ text: 'Label', lon: 5, lat: 5, rotation: 45, fontSize: 14, opacity: 0.4 }];
    RegionRenderer.renderLabels(g, labels, proj);

    expect(g.children.length).toBe(1);
    const text = g.children[0];
    expect(text.textContent).toBe('Label');
    expect(text.getAttribute('transform')).toContain('rotate(45');
  });
});
