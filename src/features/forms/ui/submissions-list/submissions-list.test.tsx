import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { SubmissionsList } from '@/features/forms';
import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import type { UserCard } from '@/features/forms/model/forms.types.ts';

import s from '../submission-card/submission-card.module.css';

const createSubmission = (id: string): UserCard => ({
  id,
  submittedAt: id,
  name: 'Anton',
  age: 29,
  country: 'BLR',
  formVariant: 'uncontrolled',
  email: 'test@gmail.com',
  gender: 'male',
  image: 'https://example.com/avatar.jpeg',
  termsAccepted: false,
});

describe('SubmissionsList', () => {
  beforeEach(() => {
    useFormsStore.setState({
      submissions: [
        createSubmission('1'),
        createSubmission('2'),
        createSubmission('3'),
      ],
      lastAddedCardId: null,
    });
  });

  afterEach(() => {
    cleanup();
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });
  });

  it('renders a card for each submission in the store', () => {
    render(<SubmissionsList />);

    expect(screen.getAllByText('Anton')).toHaveLength(3);
    expect(screen.getAllByText('test@gmail.com')).toHaveLength(3);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(<SubmissionsList classNames="custom-list" />);

    expect(container.firstElementChild).toHaveClass('custom-list');
  });

  it('renders empty state when there are no submissions', () => {
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });

    render(<SubmissionsList />);

    expect(screen.getByText('Nothing found.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'empty page' })).toBeInTheDocument();
  });

  it('highlights the last added submission card', () => {
    useFormsStore.setState({
      submissions: [createSubmission('1'), createSubmission('2')],
      lastAddedCardId: '2',
    });

    const { container } = render(<SubmissionsList />);

    const cards = container.querySelectorAll(`.${s.submissionsCard}`);
    expect(cards[1]).toHaveClass(s.isHighlighted);
    expect(cards[0]).not.toHaveClass(s.isHighlighted);
  });

  it('does not highlight any card when lastAddedCardId is null', () => {
    const { container } = render(<SubmissionsList />);

    container.querySelectorAll(`.${s.submissionsCard}`).forEach((card) => {
      expect(card).not.toHaveClass(s.isHighlighted);
    });
  });
});
