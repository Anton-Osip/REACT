import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterList } from './character-list.tsx';
import { ErrorBoundary } from '../../error-boundary';
import { createCharactersResponse } from '../../../test-utils';
import { getCharacters } from '../../../api/character';

vi.mock('../../../api/character', () => ({
  getCharacters: vi.fn(),
}));

const mockedGetCharacters = vi.mocked(getCharacters);

function CharacterListHarness({ name }: { name: string }) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [name]);
  return <CharacterList searchName={name} page={page} onPageChange={setPage} />;
}

describe('CharacterList', () => {
  const user = userEvent.setup();
  let onPageChange: (page: number) => void;

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    mockedGetCharacters.mockReset();
    onPageChange = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('shows loading grid while data is fetching', async () => {
    mockedGetCharacters.mockReturnValue(new Promise(() => {}));

    const { container } = render(
      <CharacterList searchName="" page={1} onPageChange={onPageChange} />
    );

    await waitFor(() => expect(mockedGetCharacters).toHaveBeenCalled());

    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.childElementCount).toBe(20);
  });

  it('renders character cards when data loads successfully', async () => {
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    render(
      <CharacterList searchName="" page={1} onPageChange={onPageChange} />
    );

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('shows empty state when API returns no results', async () => {
    mockedGetCharacters.mockResolvedValue(
      createCharactersResponse({ results: [] })
    );

    render(
      <CharacterList
        searchName="zzz-unknown"
        page={1}
        onPageChange={onPageChange}
      />
    );

    expect(await screen.findByText('Nothing found.')).toBeInTheDocument();
  });

  it('shows error UI and message when API call fails', async () => {
    mockedGetCharacters.mockRejectedValue(new Error('Service unavailable'));

    render(
      <CharacterList searchName="rick" page={1} onPageChange={onPageChange} />
    );

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('retries fetch when Try Again is clicked after an error', async () => {
    mockedGetCharacters
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce(createCharactersResponse());

    render(
      <CharacterList searchName="beth" page={1} onPageChange={onPageChange} />
    );

    expect(await screen.findByText('temporary')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(mockedGetCharacters).toHaveBeenCalledTimes(2);
  });

  it('fetches again when searchName prop changes and scrolls to top', async () => {
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    const { rerender } = render(<CharacterListHarness name="a" />);

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('a', 1)
    );

    rerender(<CharacterListHarness name="b" />);

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('b', 1)
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('uses page 1 when searchName changes after navigating to another page', async () => {
    mockedGetCharacters.mockResolvedValue(
      createCharactersResponse({
        info: {
          count: 40,
          pages: 2,
          next: null,
          prev: null,
        },
      })
    );

    const { rerender } = render(<CharacterListHarness name="a" />);
    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('a', 2)
    );

    rerender(<CharacterListHarness name="b" />);

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('b', 1)
    );
  });

  it('surfaces non-Error rejections as error messages', async () => {
    mockedGetCharacters.mockRejectedValue('plain string failure');

    render(
      <CharacterList searchName="" page={1} onPageChange={onPageChange} />
    );

    expect(await screen.findByText('plain string failure')).toBeInTheDocument();
  });

  it('error button is caught by error boundary and shows fallback', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    render(
      <ErrorBoundary>
        <CharacterList searchName="" page={1} onPageChange={onPageChange} />
      </ErrorBoundary>
    );

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /error button/i }));

    expect(
      await screen.findByText(
        'Test error from Error Footer - Check console for details'
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
