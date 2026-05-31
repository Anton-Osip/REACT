import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FormRhf } from './form-rhf.tsx';

describe('FormRhf', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders react hook form placeholder content', () => {
    render(<FormRhf />);

    expect(screen.getByText('FormRhf')).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(<FormRhf className="custom-form" />);

    expect(container.firstElementChild).toHaveClass('custom-form');
  });
});
