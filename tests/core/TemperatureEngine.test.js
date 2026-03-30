import { describe, it, expect, vi } from 'vitest';
import TemperatureEngine from '../../core/TemperatureEngine.js';

describe('TemperatureEngine', () => {
  it('builds month select options and handles changes', () => {
    const select = document.createElement('select');
    const callback = vi.fn();
    const engine = new TemperatureEngine(select, callback);

    expect(select.children.length).toBe(12);
    select.value = '2';
    select.dispatchEvent(new Event('change'));

    expect(engine.currentMonth).toBe(2);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('updates average temperature display for major cities', () => {
    const select = document.createElement('select');
    const engine = new TemperatureEngine(select);
    select.value = '0';
    select.dispatchEvent(new Event('change'));

    const display = document.createElement('div');
    const cities = [
      { name: 'Capital', type: 'capital', monthlyTemps: [20], population: 100 },
      { name: 'Major', type: 'major', monthlyTemps: [10], population: 50 },
      { name: 'Town', type: 'town', monthlyTemps: [5], population: 20 },
    ];

    engine.updateAvgDisplay(cities, display);
    expect(display.textContent).toContain('Avg:');
    expect(display.style.background).toContain('linear-gradient');
  });

  it('returns the current month name', () => {
    const select = document.createElement('select');
    const engine = new TemperatureEngine(select);
    expect(engine.monthName).toBeTruthy();
  });
});
