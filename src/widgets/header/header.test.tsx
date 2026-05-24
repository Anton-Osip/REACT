import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacters } from '@/features/character/api';
import { ThemeProvider } from '@/features/theme';
import {
  createCharactersResponse,
  renderWithRouter,
} from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

import { Header } from './header.tsx';

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

async function renderHeader(className?: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <Header className={className} />
      </ThemeProvider>
    ),
  });

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  const view = render(<RouterProvider router={router} />);
  await router.load();

  return view;
}

describe('Header', () => {
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

  it('renders a header landmark', async () => {
    await renderHeader();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the logo image with accessible alt text', async () => {
    await renderHeader();

    const logo = screen.getByRole('img', { name: 'logo' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  it('renders the About navigation link', async () => {
    await renderHeader();

    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('links the logo to the character page', async () => {
    await renderHeader();

    const logoLink = screen.getByRole('img', { name: 'logo' }).closest('a');
    expect(logoLink).toHaveAttribute('href', '/character?page=1');
  });

  it('links About to the about page', async () => {
    await renderHeader();

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('navigates to /about when About is clicked from /character', async () => {
    const { router } = renderWithRouter('/character');

    await screen.findByPlaceholderText('Search');

    await user.click(screen.getByRole('link', { name: 'About' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/about'));
    expect(
      await screen.findByRole('heading', { name: 'About' })
    ).toBeInTheDocument();
  });

  it('merges custom className onto the header element', async () => {
    const { container } = await renderHeader('site-header');

    const header = container.querySelector('header');
    expect(header).toHaveClass('site-header');
  });

  it('renders the Error Button for simulating errors', async () => {
    await renderHeader();

    expect(
      screen.getByRole('button', { name: 'Error Button' })
    ).toBeInTheDocument();
  });
});
