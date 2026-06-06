import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DetailRow } from './detail-row.tsx';

describe('DetailRow', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders label and value', () => {
    render(<DetailRow label="Age" value={29} />);

    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();
  });

  it('renders string values', () => {
    render(<DetailRow label="Country" value="BLR" />);

    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('BLR')).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <DetailRow className="custom-row" label="Gender" value="Male" />
    );

    expect(container.firstElementChild).toHaveClass('custom-row');
  });
});
