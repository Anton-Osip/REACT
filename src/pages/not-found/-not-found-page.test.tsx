import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import errorPageImage from '@/shared/assets/image/errorPageImage.png';
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

describe('NotFoundPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders 404 title and message', async () => {
    await renderWithRouter('/unknown-route');

    expect(await screen.findByText('404 — Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
  });

  it('renders not-found illustration with accessible alt text', async () => {
    await renderWithRouter('/unknown-route');

    expect(
      await screen.findByRole('img', { name: 'page not found' })
    ).toHaveAttribute('src', errorPageImage);
  });

  it('renders link to the characters page', async () => {
    await renderWithRouter('/unknown-route');

    await screen.findByText('404 — Page not found');

    const backLink = screen.getByRole('link', { name: 'Back to characters' });
    expect(backLink).toHaveAttribute('href', '/character');
  });

  it('navigates to /character when Back to characters is clicked', async () => {
    const { router } = await renderWithRouter('/unknown-route');

    await screen.findByText('404 — Page not found');

    await user.click(screen.getByRole('link', { name: 'Back to characters' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/character');
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });
});
