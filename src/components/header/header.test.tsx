import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { Header } from './header';

async function renderHeader(className?: string) {
  const rootRoute = createRootRoute({
    component: () => <Header className={className} />,
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
  afterEach(() => {
    cleanup();
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

  it('links About to the character page', async () => {
    await renderHeader();

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/character'
    );
  });

  it('merges custom className onto the header element', async () => {
    const { container } = await renderHeader('site-header');

    const header = container.querySelector('header');
    expect(header).toHaveClass('site-header');
  });
});
