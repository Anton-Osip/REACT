import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CheckIcon, CheckIconSvg } from './check-icon.tsx';

describe('CheckIcon', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders svg path inside the icon', () => {
    const { container } = render(<CheckIcon size={20} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });

  it('exposes decorative wrapper for assistive tech', () => {
    render(<CheckIcon size={20} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('applies size to the wrapper', () => {
    render(<CheckIcon size={32} />);

    expect(screen.getByRole('img', { hidden: true })).toHaveStyle({
      height: '32px',
      width: '32px',
    });
  });

  it('forwards svgProps to the svg element', () => {
    const { container } = render(
      <CheckIcon svgProps={{ id: 'check-svg-forward-test' }} />
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'id',
      'check-svg-forward-test'
    );
  });
});

describe('CheckIconSvg', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders standalone svg', () => {
    const { container } = render(<CheckIconSvg aria-hidden="true" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.querySelector('path')).toBeInTheDocument();
  });
});
