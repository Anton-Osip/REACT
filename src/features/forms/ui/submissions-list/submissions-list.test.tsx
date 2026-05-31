import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SubmissionsList } from './submissions-list.tsx';

describe('SubmissionsList', () => {
  afterEach(() => {
    cleanup();
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
