import { describe, it, expect, vi } from 'vitest';
import HomeUI from '../../ui/HomeUI.js';

class StubModule {
  constructor(id, name, capital, continent) {
    this.meta = { id, name, flag: '🏳️', capital, continent, description: 'desc' };
  }
}

describe('HomeUI', () => {
  it('renders cards from registry and filters results', () => {
    const container = document.createElement('div');
    const registry = new Map([
      ['egypt', new StubModule('egypt', 'Egypt', 'Cairo', 'Africa')],
      ['greece', new StubModule('greece', 'Greece', 'Athens', 'Europe')],
    ]);
    const onSelect = vi.fn();
    const home = new HomeUI(container, registry, onSelect);

    expect(container.querySelectorAll('.country-card').length).toBe(2);
    const search = container.querySelector('.home-search');
    search.value = 'Greece';
    search.dispatchEvent(new Event('input'));

    expect(home.cards.get('egypt').el.style.display).toBe('none');
    expect(home.cards.get('greece').el.style.display).not.toBe('none');
  });

  it('activates selected card and calls onSelect', () => {
    const container = document.createElement('div');
    const registry = new Map([['egypt', new StubModule('egypt', 'Egypt', 'Cairo', 'Africa')]]);
    const onSelect = vi.fn();
    const home = new HomeUI(container, registry, onSelect);

    const cardEl = container.querySelector('.country-card');
    cardEl.click();

    expect(onSelect).toHaveBeenCalledWith('egypt');
    expect(home.cards.get('egypt').el.classList.contains('active')).toBe(true);
  });

  it('toggles visibility with show/hide', () => {
    const container = document.createElement('div');
    const registry = new Map([['egypt', new StubModule('egypt', 'Egypt', 'Cairo', 'Africa')]]);
    const home = new HomeUI(container, registry, () => {});

    home.hide();
    expect(container.style.display).toBe('none');
    home.show();
    expect(container.style.display).toBe('');
  });
});
