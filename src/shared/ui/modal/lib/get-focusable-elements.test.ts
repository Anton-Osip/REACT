import { describe, expect, it } from 'vitest';

import { getFocusableElements } from './get-focusable-elements.ts';

describe('getFocusableElements', () => {
  it('returns focusable interactive elements inside root', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button type="button">One</button>
      <input type="text" />
      <button type="button" disabled>Disabled</button>
      <a href="#">Link</a>
      <div tabindex="-1">Skipped</div>
    `;

    const focusable = getFocusableElements(root);

    expect(focusable).toHaveLength(3);
    expect(focusable[0].tagName).toBe('BUTTON');
    expect(focusable[1].tagName).toBe('INPUT');
    expect(focusable[2].tagName).toBe('A');
  });

  it('excludes elements with aria-hidden="true"', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button type="button">Visible</button>
      <button type="button" aria-hidden="true">Hidden</button>
    `;

    expect(getFocusableElements(root)).toHaveLength(1);
  });
});
