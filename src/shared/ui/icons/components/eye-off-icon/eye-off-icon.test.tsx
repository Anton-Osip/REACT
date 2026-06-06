import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EyeOffIcon } from './eye-off-icon.tsx';

describe('EyeOffIcon', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders svg path inside the icon', () => {
    const { container } = render(<EyeOffIcon size={20} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });

  it('exposes decorative wrapper for assistive tech', () => {
    render(<EyeOffIcon size={20} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('applies size to the wrapper', () => {
    render(<EyeOffIcon size={32} />);

    expect(screen.getByRole('img', { hidden: true })).toHaveStyle({
      height: '32px',
      width: '32px',
    });
  });

  it('forwards svgProps to the svg element', () => {
    const { container } = render(
      <EyeOffIcon svgProps={{ id: 'eye-off-svg-forward-test' }} />
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'id',
      'eye-off-svg-forward-test'
    );
  });
});
