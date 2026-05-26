import { useEffect, useState } from 'react';

import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { characterQueryKeys } from '@/features/character/api/queries.ts';
import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';
import {
  createCharactersResponse,
  createErrorCharactersQuery,
  createLoadingCharactersQuery,
  createSuccessCharactersQuery,
  renderWithQueryClient,
  renderWithRouter,
  useGetCharactersMock,
} from '@/shared/test-utils';

import { CharacterList } from './character-list.tsx';

function CharacterListHarness({ name }: { name: string }) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [name]);
  return <CharacterList searchName={name} page={page} />;
}

function getCharacterSelectButton(characterName: string): HTMLButtonElement {
  const image = screen.getAllByRole('img', { name: characterName })[0];
  const card = image.parentElement?.parentElement;
  const button = card?.querySelector('button');

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Select button not found for "${characterName}"`);
  }

  return button;
}

function resetSelectedStore() {
  useSelectedCharacterStore.setState({ selectedCharacters: null });
}

describe('CharacterList', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    resetSelectedStore();
    useGetCharactersMock.mockReset();
    useGetCharactersMock.mockReturnValue(createSuccessCharactersQuery());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('shows loading grid while data is fetching', async () => {
    useGetCharactersMock.mockReturnValue(createLoadingCharactersQuery());

    const { container } = renderWithQueryClient(
      <CharacterList searchName="" page={1} />
    );

    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.childElementCount).toBe(20);
  });

  it('renders character cards when data loads successfully', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(createCharactersResponse())
    );

    renderWithQueryClient(<CharacterList searchName="" page={1} />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('shows empty state when API returns no results', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(createCharactersResponse({ results: [] }))
    );

    renderWithQueryClient(<CharacterList searchName="zzz-unknown" page={1} />);

    expect(await screen.findByText('Nothing found.')).toBeInTheDocument();
  });

  it('shows error UI and message when API call fails', async () => {
    useGetCharactersMock.mockReturnValue(
      createErrorCharactersQuery(new Error('Service unavailable'))
    );

    renderWithQueryClient(<CharacterList searchName="rick" page={1} />);

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('retries fetch when Try Again is clicked after an error', async () => {
    let attempt = 0;
    const view: {
      rerender: ReturnType<typeof renderWithQueryClient>['rerender'];
    } = {
      rerender: () => {},
    };

    useGetCharactersMock.mockImplementation(() => {
      if (attempt === 0) {
        return createErrorCharactersQuery(
          new Error('temporary'),
          vi.fn(() => {
            attempt = 1;
            view.rerender(<CharacterList searchName="beth" page={1} />);
            return Promise.resolve();
          }) as unknown as Parameters<typeof createErrorCharactersQuery>[1]
        );
      }

      return createSuccessCharactersQuery(createCharactersResponse());
    });

    ({ rerender: view.rerender } = renderWithQueryClient(
      <CharacterList searchName="beth" page={1} />
    ));

    expect(await screen.findByText('temporary')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('fetches again when searchName prop changes and scrolls to top', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(createCharactersResponse())
    );

    const { rerender } = renderWithQueryClient(
      <CharacterListHarness name="a" />
    );

    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenLastCalledWith({
        name: 'a',
        page: 1,
      })
    );

    rerender(<CharacterListHarness name="b" />);

    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenLastCalledWith({
        name: 'b',
        page: 1,
      })
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('uses page 1 when searchName changes after navigating to another page', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(
        createCharactersResponse({
          info: {
            count: 40,
            pages: 2,
            next: null,
            prev: null,
          },
        })
      )
    );

    const { router } = await renderWithRouter('/character?search=a&page=1');
    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenLastCalledWith({
        name: 'a',
        page: 2,
      })
    );

    await router.navigate({
      to: '/character',
      search: { search: 'b', page: 1 },
    });

    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenLastCalledWith({
        name: 'b',
        page: 1,
      })
    );
  });

  it('surfaces non-Error rejections as error messages', async () => {
    useGetCharactersMock.mockReturnValue(
      createErrorCharactersQuery('plain string failure')
    );

    renderWithQueryClient(<CharacterList searchName="" page={1} />);

    expect(await screen.findByText('plain string failure')).toBeInTheDocument();
  });

  it('invalidates list cache when Refresh characters is clicked', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(
        createCharactersResponse({
          info: {
            count: 40,
            pages: 2,
            next: null,
            prev: null,
          },
        })
      )
    );

    const { queryClient } = renderWithQueryClient(
      <CharacterList searchName="rick" page={1} />
    );
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await screen.findByText('Rick Sanchez');
    await user.click(
      screen.getByRole('button', { name: /refresh characters/i })
    );

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: characterQueryKeys.list({ name: 'rick', page: 1 }),
    });
  });

  it('stores selected character in zustand when star is clicked', async () => {
    await renderWithRouter('/character');
    await screen.findByText('Rick Sanchez');
    await user.click(getCharacterSelectButton('Rick Sanchez'));

    expect(
      useSelectedCharacterStore.getState().selectedCharacters?.has(1)
    ).toBe(true);
    expect(getCharacterSelectButton('Rick Sanchez').className).toMatch(
      /isSelected/
    );
  });

  it('removes character from store when star is clicked again', async () => {
    await renderWithRouter('/character');

    await screen.findByText('Rick Sanchez');

    const selectButton = getCharacterSelectButton('Rick Sanchez');
    await user.click(selectButton);
    await user.click(selectButton);

    expect(
      useSelectedCharacterStore.getState().selectedCharacters?.has(1)
    ).toBe(false);
  });

  it('keeps selected characters when navigating to another route', async () => {
    const { router } = await renderWithRouter('/character');
    await screen.findByText('Rick Sanchez');
    await user.click(getCharacterSelectButton('Rick Sanchez'));

    expect(
      useSelectedCharacterStore.getState().selectedCharacters?.has(1)
    ).toBe(true);

    await router.navigate({ to: '/about' });
    await router.navigate({
      to: '/character',
      search: { search: undefined, page: 1 },
    });

    await waitFor(() => {
      expect(getCharacterSelectButton('Rick Sanchez').className).toMatch(
        /isSelected/
      );
    });
  });

  it('keeps selected characters when pagination page changes', async () => {
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(
        createCharactersResponse({
          info: {
            count: 40,
            pages: 2,
            next: null,
            prev: null,
          },
        })
      )
    );

    await renderWithRouter('/character?page=1');
    await screen.findByText('Rick Sanchez');

    await user.click(getCharacterSelectButton('Rick Sanchez'));
    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenLastCalledWith({
        name: undefined,
        page: 2,
      })
    );
    expect(
      useSelectedCharacterStore.getState().selectedCharacters?.has(1)
    ).toBe(true);

    await user.click(screen.getByRole('button', { name: '1' }));

    await waitFor(() => {
      expect(getCharacterSelectButton('Rick Sanchez').className).toMatch(
        /isSelected/
      );
    });
  });
});
