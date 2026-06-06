import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import type { UserCard } from '@/features/forms/model/forms.types.ts';
import { renderWithRouter } from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

vi.mock('@/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utils')>();
  return {
    ...actual,
    loadFromStorage: vi.fn(),
  };
});

const mockedLoadFromStorage = vi.mocked(loadFromStorage);

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

describe('FormsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
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
    document.body.style.overflow = '';
    useFormsStore.setState({ submissions: [] });
  });

  it('renders form action buttons', async () => {
    await renderWithRouter('/forms');

    expect(
      await screen.findByRole('button', { name: 'Uncontrolled' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'React Hook Form' })
    ).toBeInTheDocument();
  });

  it('renders submissions from the store', async () => {
    await renderWithRouter('/forms');

    expect(await screen.findAllByText('Anton')).toHaveLength(3);
  });

  it('opens uncontrolled form modal from the page', async () => {
    await renderWithRouter('/forms');

    await user.click(
      await screen.findByRole('button', { name: 'Uncontrolled' })
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
