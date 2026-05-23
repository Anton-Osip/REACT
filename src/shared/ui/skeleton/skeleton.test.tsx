import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton.tsx';

describe('Skeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a single root div', () => {
    const { container } = render(<Skeleton />);

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="card-skeleton" />);

    expect(container.firstElementChild).toHaveClass('card-skeleton');
  });

  it('forwards native div attributes', () => {
    const { container } = render(
      <Skeleton data-testid="loading-block" aria-busy="true" />
    );

    const el = container.firstElementChild;
    expect(el).toHaveAttribute('data-testid', 'loading-block');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });
});
