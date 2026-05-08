import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Skeleton } from './skeleton.tsx';

describe('Skeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders div element', () => {
    render(<Skeleton />);
    const skeleton = document.querySelector('div');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton?.tagName).toBe('DIV');
  });
});
