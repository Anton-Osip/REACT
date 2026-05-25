import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import {
  cleanup,
  screen,
  waitFor,
  within,
  render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/providers';
import {
  createCharactersResponse,
  createErrorDetailsQuery,
  createLoadingDetailsQuery,
  createSuccessDetailsQuery,
  renderWithRouter,
  useGetCharactersDetailsMock,
} from '@/shared/test-utils';

import { CharacterDetails } from './character-details.tsx';

const rootRoute = createRootRoute();
const characterDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$id',
  component: CharacterDetails,
});
const routeTree = rootRoute.addChildren([characterDetailsRoute]);

function renderCharacterDetailsRoute(characterId = '1') {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [`/character/${characterId}`],
    }),
  });

  return {
    router,
    ...render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    ),
  };
}

async function findDetailsPanel() {
  return waitFor(() => {
    const panel = document.querySelector('[class*="characterDetails"]');
    if (!panel) {
      throw new Error('Character details panel not found');
    }
    return panel as HTMLElement;
  });
}

describe('CharacterDetails', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useGetCharactersDetailsMock.mockReset();
    useGetCharactersDetailsMock.mockReturnValue(createLoadingDetailsQuery());
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders nothing when detailsId is undefined', async () => {
    await renderWithRouter('/character');

    expect(useGetCharactersDetailsMock).not.toHaveBeenCalled();
    expect(
      document.querySelector('[class*="characterDetails"]')
    ).not.toBeInTheDocument();
  });

  it('shows skeleton while data is fetching', async () => {
    useGetCharactersDetailsMock.mockReturnValue(createLoadingDetailsQuery());

    const { container } = renderCharacterDetailsRoute('1');

    await waitFor(() =>
      expect(useGetCharactersDetailsMock).toHaveBeenCalledWith({
        characterId: 1,
      })
    );

    expect(container.querySelector('[class*="skeleton"]')).toBeInTheDocument();
  });

  it('renders character fields when data loads successfully', async () => {
    const character = createCharactersResponse().results[0];
    useGetCharactersDetailsMock.mockReturnValue(
      createSuccessDetailsQuery(character)
    );

    renderCharacterDetailsRoute('1');

    const details = await findDetailsPanel();

    expect(within(details).getByText(character.name)).toBeInTheDocument();
    expect(within(details).getByText(character.gender)).toBeInTheDocument();
    expect(
      within(details).getByText(character.location.name)
    ).toBeInTheDocument();
    expect(within(details).getByText(character.species)).toBeInTheDocument();
    expect(within(details).getByText(character.status)).toBeInTheDocument();
    expect(
      within(details).getByRole('img', { name: character.name })
    ).toHaveAttribute('src', character.image);
  });

  it('shows error UI when API call fails', async () => {
    useGetCharactersDetailsMock.mockReturnValue(
      createErrorDetailsQuery(new Error('Service unavailable'))
    );

    renderCharacterDetailsRoute('1');

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
  });

  it('calls refetch when Try Again is clicked after an error', async () => {
    const refetch = vi.fn();

    useGetCharactersDetailsMock.mockReturnValue(
      createErrorDetailsQuery(new Error('first failure'), refetch)
    );

    renderCharacterDetailsRoute('1');

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(refetch).toHaveBeenCalled();
  });

  it('wraps non-Error rejections in Error', async () => {
    useGetCharactersDetailsMock.mockReturnValue(
      createErrorDetailsQuery('boom')
    );

    renderCharacterDetailsRoute('1');

    expect(await screen.findByText('boom')).toBeInTheDocument();
  });

  it('navigates to character list when close button is clicked', async () => {
    const character = createCharactersResponse().results[0];
    useGetCharactersDetailsMock.mockReturnValue(
      createSuccessDetailsQuery(character)
    );

    const { router } = renderCharacterDetailsRoute('1');
    const details = await findDetailsPanel();
    const closeButton = details.querySelector('[class*="closeBtn"]');

    expect(closeButton).toBeInstanceOf(HTMLButtonElement);
    await user.click(closeButton as HTMLButtonElement);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/character');
    });
  });

  it('refetches when detailsId changes', async () => {
    const [first, second] = createCharactersResponse().results;
    useGetCharactersDetailsMock.mockImplementation(
      ({ characterId }: { characterId: number }) =>
        characterId === 1
          ? createSuccessDetailsQuery(first)
          : createSuccessDetailsQuery(second)
    );

    const { router } = renderCharacterDetailsRoute('1');

    const firstDetails = await findDetailsPanel();
    expect(within(firstDetails).getByText(first.name)).toBeInTheDocument();

    await router.navigate({
      to: '/character/$id',
      params: { id: '2' },
      search: { search: undefined, page: 1 },
    });

    const secondDetails = await findDetailsPanel();
    expect(within(secondDetails).getByText(second.name)).toBeInTheDocument();
    expect(useGetCharactersDetailsMock).toHaveBeenCalledWith({
      characterId: 1,
    });
    expect(useGetCharactersDetailsMock).toHaveBeenCalledWith({
      characterId: 2,
    });
  });
});
