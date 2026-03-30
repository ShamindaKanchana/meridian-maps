import { describe, it, expect, vi } from 'vitest';
import CountryCard from '../../ui/CountryCard.js';

describe('CountryCard', () => {
  it('builds a DOM card and emits click events', () => {
    const meta = { id: 'egypt', name: 'Egypt', flag: '🇪🇬', capital: 'Cairo', continent: 'Africa', description: 'Test' };
    const onClick = vi.fn();
    const card = new CountryCard(meta, onClick);

    expect(card.el.dataset.id).toBe('egypt');
    expect(card.el.querySelector('.card-name').textContent).toBe('Egypt');

    card.el.click();
    expect(onClick).toHaveBeenCalledWith('egypt');
  });

  it('toggles active CSS state', () => {
    const card = new CountryCard({ id: 'egypt', name: 'Egypt', flag: '🇪🇬', capital: 'Cairo', continent: 'Africa', description: 'Test' }, () => {});
    card.setActive(true);
    expect(card.el.classList.contains('active')).toBe(true);
    card.setActive(false);
    expect(card.el.classList.contains('active')).toBe(false);
  });
});
