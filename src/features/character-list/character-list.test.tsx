import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterList } from './character-list';
import { ErrorBoundary } from '../error-boundary';
import { createCharactersResponse } from '../../test-utils';
import { getCharacters } from '../../api/character';

vi.mock('../../api/character', () => ({
  getCharacters: vi.fn(),
}));

const mockedGetCharacters = vi.mocked(getCharacters);

describe('CharacterList', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    mockedGetCharacters.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('shows loading grid while data is fetching', async () => {
    mockedGetCharacters.mockReturnValue(new Promise(() => {}));

    const { container } = render(<CharacterList searchName="" />);

    await waitFor(() => expect(mockedGetCharacters).toHaveBeenCalled());

    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.childElementCount).toBe(20);
  });

  it('renders character cards when data loads successfully', async () => {
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    render(<CharacterList searchName="" />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('shows empty state when API returns no results', async () => {
    mockedGetCharacters.mockResolvedValue(
      createCharactersResponse({ results: [] })
    );

    render(<CharacterList searchName="zzz-unknown" />);

    expect(await screen.findByText('Nothing found.')).toBeInTheDocument();
  });

  it('shows error UI and message when API call fails', async () => {
    mockedGetCharacters.mockRejectedValue(new Error('Service unavailable'));

    render(<CharacterList searchName="rick" />);

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('retries fetch when Try Again is clicked after an error', async () => {
    mockedGetCharacters
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce(createCharactersResponse());

    render(<CharacterList searchName="beth" />);

    expect(await screen.findByText('temporary')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(mockedGetCharacters).toHaveBeenCalledTimes(2);
  });

  it('fetches again when searchName prop changes and scrolls to top', async () => {
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    const { rerender } = render(<CharacterList searchName="a" />);

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('a')
    );

    rerender(<CharacterList searchName="b" />);

    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenLastCalledWith('b')
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('surfaces non-Error rejections as error messages', async () => {
    mockedGetCharacters.mockRejectedValue('plain string failure');

    render(<CharacterList searchName="" />);

    expect(await screen.findByText('plain string failure')).toBeInTheDocument();
  });

  it('error button is caught by error boundary and shows fallback', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    render(
      <ErrorBoundary>
        <CharacterList searchName="" />
      </ErrorBoundary>
    );

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /error button/i }));

    expect(
      await screen.findByText(
        'Test error from Error Button - Check console for details'
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
