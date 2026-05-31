import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('FormsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
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

    expect(screen.getByText('UncontrolledForms')).toBeInTheDocument();
  });
});
