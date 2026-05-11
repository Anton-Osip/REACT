import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SearchIcon } from './SearchIcon';

describe('SearchIcon', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders svg paths inside the icon', () => {
    const { container } = render(<SearchIcon size={20} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });

  it('exposes decorative wrapper for assistive tech', () => {
    render(<SearchIcon size={20} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('applies size to the wrapper', () => {
    render(<SearchIcon size={32} />);

    expect(screen.getByRole('img', { hidden: true })).toHaveStyle({
      height: '32px',
      width: '32px',
    });
  });

  it('forwards svgProps to the svg element', () => {
    const { container } = render(
      <SearchIcon svgProps={{ 'data-testid': 'search-svg' }} />
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'data-testid',
      'search-svg'
    );
  });
});
