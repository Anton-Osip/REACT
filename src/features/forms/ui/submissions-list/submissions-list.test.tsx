import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import type { UserCard } from '@/features/forms/model/forms.types.ts';

import { SubmissionsList } from './submissions-list.tsx';

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
    });
  });

  afterEach(() => {
    cleanup();
    useFormsStore.setState({ submissions: [] });
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
});
