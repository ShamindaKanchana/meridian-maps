import { describe, it, expect } from 'vitest';
import { valueToColor, tempToColor, popToRadius } from '../../utils/colorScale.js';

describe('colorScale utilities', () => {
  it('returns the first stop for values below minimum', () => {
    expect(valueToColor(-100)).toBe('#a0c8f0');
  });

  it('returns the last stop for values above maximum', () => {
    expect(valueToColor(100)).toBe('#7a0000');
  });

  it('returns exact stop colors when values match stop boundaries', () => {
    expect(tempToColor(20)).toBe('#f5e44a');
    expect(tempToColor(-10)).toBe('#a0c8f0');
  });

  it('interpolates correctly between stops', () => {
    const color = valueToColor(12.5);
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
    expect(color).not.toBe('#a8e0a0');
  });

  it('scales population radius correctly', () => {
    expect(popToRadius(50, 100, { minR: 3, maxR: 14 })).toBeCloseTo(3 + (50 / 100) * 11);
    expect(popToRadius(100, 100)).toBe(14);
  });
});
