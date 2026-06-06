import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { UserCard } from '@/features/forms/model/forms.types.ts';

import { SubmissionCard } from './submission-card.tsx';

import s from './submission-card.module.css';

const createSubmission = (overrides: Partial<UserCard> = {}): UserCard => ({
  id: '1',
  age: 29,
  country: 'BLR',
  formVariant: 'uncontrolled',
  email: 'test@gmail.com',
  gender: 'male',
  image: 'https://example.com/avatar.jpeg',
  name: 'Anton',
  submittedAt: '879865413468',
  termsAccepted: false,
  ...overrides,
});

describe('SubmissionCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders submission details', () => {
    render(
      <SubmissionCard submission={createSubmission()} isHighlighted={false} />
    );

    expect(screen.getByRole('img', { name: 'Anton' })).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpeg'
    );
    expect(screen.getByText('Anton')).toBeInTheDocument();
    expect(screen.getByText('test@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('BLR')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
  });

  it('shows Yes when terms are accepted', () => {
    render(
      <SubmissionCard
        submission={createSubmission({
          termsAccepted: true,
          formVariant: 'rhf',
        })}
        isHighlighted={false}
      />
    );

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <SubmissionCard
        classNames="custom-card"
        submission={createSubmission()}
        isHighlighted={false}
      />
    );

    expect(container.firstElementChild).toHaveClass('custom-card');
  });

  it('applies highlight class when isHighlighted is true', () => {
    const { container } = render(
      <SubmissionCard submission={createSubmission()} isHighlighted={true} />
    );

    expect(container.firstElementChild).toHaveClass(s.isHighlighted);
  });

  it('does not apply highlight class when isHighlighted is false', () => {
    const { container } = render(
      <SubmissionCard submission={createSubmission()} isHighlighted={false} />
    );

    expect(container.firstElementChild).not.toHaveClass(s.isHighlighted);
  });
});
