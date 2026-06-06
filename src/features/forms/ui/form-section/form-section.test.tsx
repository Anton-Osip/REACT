import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { FormSection } from './form-section.tsx';

describe('FormSection', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('renders buttons for both form variants', () => {
    render(<FormSection />);

    expect(
      screen.getByRole('button', { name: 'Uncontrolled' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'React Hook Form' })
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal when Uncontrolled is clicked', async () => {
    render(<FormSection />);

    await user.click(screen.getByRole('button', { name: 'Uncontrolled' }));

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('opens react hook form modal when React Hook Form is clicked', async () => {
    render(<FormSection />);

    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(<FormSection className="custom-section" />);

    expect(container.firstElementChild).toHaveClass('custom-section');
  });
});
