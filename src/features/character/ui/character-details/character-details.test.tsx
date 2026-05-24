import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacterDetails, getCharacters } from '@/features/character/api';
import {
  createCharactersResponse,
  renderWithRouter,
} from '@/shared/test-utils';

vi.mock('@/features/character/api', () => ({
  getCharacterDetails: vi.fn(),
  getCharacters: vi.fn(),
}));

const mockedGetCharacterDetails = vi.mocked(getCharacterDetails);
const mockedGetCharacters = vi.mocked(getCharacters);

describe('CharacterDetails', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedGetCharacterDetails.mockReset();
    mockedGetCharacters.mockReset();
    mockedGetCharacters.mockResolvedValue(
      createCharactersResponse({ results: [] })
    );
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders nothing when detailsId is undefined', () => {
    renderWithRouter('/character');

    expect(mockedGetCharacterDetails).not.toHaveBeenCalled();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows skeleton while data is fetching', async () => {
    mockedGetCharacterDetails.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithRouter('/character/1');

    await waitFor(() =>
      expect(mockedGetCharacterDetails).toHaveBeenCalledWith(1)
    );

    expect(container.querySelector('[class*="skeleton"]')).toBeInTheDocument();
  });

  it('renders character fields when data loads successfully', async () => {
    const character = createCharactersResponse().results[0];
    mockedGetCharacterDetails.mockResolvedValue(character);

    renderWithRouter('/character/1');

    expect(await screen.findByText(character.name)).toBeInTheDocument();
    expect(screen.getByText(character.gender)).toBeInTheDocument();
    expect(screen.getByText(character.location.name)).toBeInTheDocument();
    expect(screen.getByText(character.species)).toBeInTheDocument();
    expect(screen.getByText(character.status)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: character.name })).toHaveAttribute(
      'src',
      character.image
    );
  });

  it('shows error UI when API call fails', async () => {
    mockedGetCharacterDetails.mockRejectedValue(
      new Error('Service unavailable')
    );

    renderWithRouter('/character/1');

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
  });

  it('retries loading when Try Again is clicked', async () => {
    const character = createCharactersResponse().results[0];
    mockedGetCharacterDetails
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce(character);

    renderWithRouter('/character/1');

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(await screen.findByText(character.name)).toBeInTheDocument();
    expect(mockedGetCharacterDetails).toHaveBeenCalledTimes(2);
  });

  it('wraps non-Error rejections in Error', async () => {
    mockedGetCharacterDetails.mockRejectedValue('boom');

    renderWithRouter('/character/1');

    expect(await screen.findByText('boom')).toBeInTheDocument();
  });

  it('refetches when detailsId changes', async () => {
    const [first, second] = createCharactersResponse().results;
    mockedGetCharacterDetails
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);

    const { router } = renderWithRouter('/character/1');

    expect(await screen.findByText(first.name)).toBeInTheDocument();

    await router.navigate({
      to: '/character/$id',
      params: { id: '2' },
      search: { search: undefined, page: 1 },
    });

    expect(await screen.findByText(second.name)).toBeInTheDocument();
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(1);
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(2);
  });
});
