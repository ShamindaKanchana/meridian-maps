import { describe, it, expect } from 'vitest';
import Tooltip from '../../ui/Tooltip.js';

describe('Tooltip', () => {
  it('appends tooltip element and shows/hides correctly', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 });
    const tooltip = new Tooltip(container);

    expect(container.contains(tooltip.el)).toBe(true);
    tooltip.showAt('<span>test</span>', { clientX: 50, clientY: 50 });
    expect(tooltip.el.style.display).toBe('block');
    expect(tooltip.el.innerHTML).toContain('test');

    tooltip.hide();
    expect(tooltip.el.style.display).toBe('none');
  });

  it('moves tooltip within container bounds', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 });
    const tooltip = new Tooltip(container);
    tooltip.move({ clientX: 190, clientY: 190 });

    expect(tooltip.el.style.left).toContain('px');
    expect(tooltip.el.style.top).toContain('px');
  });

  it('generates city and landmark HTML snippets', () => {
    const city = { name: 'Cairo', population: 1000000, monthlyTemps: [20, 22, 25], type: 'capital' };
    const cityHtml = Tooltip.cityHtml(city, 20, '#ff0000', 'January');
    expect(cityHtml).toContain('Cairo');
    expect(cityHtml).toContain('Population');

    const landmark = { name: 'Pyramid', description: 'Ancient wonder', size: 146 }; 
    const landmarkHtml = Tooltip.landmarkHtml(landmark);
    expect(landmarkHtml).toContain('Pyramid');
    expect(landmarkHtml).toContain('Ancient wonder');
    expect(landmarkHtml).toContain('146m');
  });
});
