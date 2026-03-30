import { describe, it, expect, vi } from 'vitest';
import HomeUI from '../../ui/HomeUI.js';
import TemperatureEngine from '../../core/TemperatureEngine.js';
import EgyptModule from '../../modules/egypt/EgyptModule.js';
import Tooltip from '../../ui/Tooltip.js';

describe('full application flow', () => {
  it('renders country cards, selects Egypt, and updates temperature display', async () => {
    const container = document.createElement('div');
    const registry = new Map([['egypt', new EgyptModule()]]);
    let selected = null;
    const home = new HomeUI(container, registry, id => { selected = id; });

    expect(container.querySelectorAll('.country-card').length).toBe(1);
    container.querySelector('.country-card').click();
    expect(selected).toBe('egypt');

    const select = document.createElement('select');
    const display = document.createElement('div');
    const engine = new TemperatureEngine(select, vi.fn());
    select.value = '0';
    select.dispatchEvent(new Event('change'));

    engine.updateAvgDisplay(registry.get('egypt').cities, display);
    expect(display.textContent).toContain('Avg');

    const tooltip = new Tooltip(container);
    tooltip.showAt('<strong>hello</strong>', { clientX: 10, clientY: 10 });
    expect(tooltip.el.style.display).toBe('block');
  });
});
