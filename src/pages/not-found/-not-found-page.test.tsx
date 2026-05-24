import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacters } from '@/features/character/api';
import errorPageImage from '@/shared/assets/image/errorPageImage.png';
import {
  createCharactersResponse,
  renderWithRouter,
} from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

vi.mock('@/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utils')>();
  return {
    ...actual,
    loadFromStorage: vi.fn(),
  };
});

vi.mock('@/features/character/api', () => ({
  getCharacters: vi.fn(),
}));

const mockedLoadFromStorage = vi.mocked(loadFromStorage);
const mockedGetCharacters = vi.mocked(getCharacters);

describe('NotFoundPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
    mockedGetCharacters.mockReset();
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders 404 title and message', async () => {
    renderWithRouter('/unknown-route');

    expect(await screen.findByText('404 — Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
  });

  it('renders not-found illustration with accessible alt text', async () => {
    renderWithRouter('/unknown-route');

    expect(
      await screen.findByRole('img', { name: 'page not found' })
    ).toHaveAttribute('src', errorPageImage);
  });

  it('renders link to the characters page', async () => {
    renderWithRouter('/unknown-route');

    await screen.findByText('404 — Page not found');

    const backLink = screen.getByRole('link', { name: 'Back to characters' });
    expect(backLink).toHaveAttribute('href', '/character');
  });

  it('navigates to /character when Back to characters is clicked', async () => {
    const { router } = renderWithRouter('/unknown-route');

    await screen.findByText('404 — Page not found');

    await user.click(screen.getByRole('link', { name: 'Back to characters' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/character')
    );
    expect(await screen.findByPlaceholderText('Search')).toBeInTheDocument();
  });
});
