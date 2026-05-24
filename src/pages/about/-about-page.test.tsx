import { cleanup, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacters } from '@/features/character/api';
import {
  createCharactersResponse,
  renderWithRouter,
} from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

import { RS_SCHOOL_REACT_URL, author } from './-about-page';

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

describe('AboutPage', () => {
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

  it('renders the About page title', async () => {
    renderWithRouter('/about');

    expect(
      await screen.findByRole('heading', { name: 'About' })
    ).toBeInTheDocument();
  });

  it('renders the author name', async () => {
    renderWithRouter('/about');

    expect(await screen.findByText(author.name)).toBeInTheDocument();
  });

  it('renders the RS School React course link with safe external attributes', async () => {
    renderWithRouter('/about');

    const courseLink = await screen.findByRole('link', {
      name: 'RS School React course',
    });

    expect(courseLink).toHaveAttribute('href', RS_SCHOOL_REACT_URL);
    expect(courseLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
