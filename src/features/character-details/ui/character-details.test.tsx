import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterDetails } from './character-details.tsx';
import { getCharacterDetails } from '../../../api/character';
import { createCharactersResponse } from '../../../test-utils';

vi.mock('../../../api/character', () => ({
  getCharacterDetails: vi.fn(),
}));

const mockedGetCharacterDetails = vi.mocked(getCharacterDetails);

describe('CharacterDetails', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedGetCharacterDetails.mockReset();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders nothing when detailsId is undefined', () => {
    const { container } = render(<CharacterDetails />);

    expect(container.firstChild).toBeNull();
    expect(mockedGetCharacterDetails).not.toHaveBeenCalled();
  });

  it('shows skeleton while data is fetching', async () => {
    mockedGetCharacterDetails.mockReturnValue(new Promise(() => {}));

    const { container } = render(<CharacterDetails detailsId={1} />);

    await waitFor(() =>
      expect(mockedGetCharacterDetails).toHaveBeenCalledWith(1)
    );

    expect(container.querySelector('[class*="skeleton"]')).toBeInTheDocument();
  });

  it('renders character fields when data loads successfully', async () => {
    const character = createCharactersResponse().results[0];
    mockedGetCharacterDetails.mockResolvedValue(character);

    render(<CharacterDetails detailsId={1} />);

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

    render(<CharacterDetails detailsId={1} />);

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
  });

  it('retries loading when Try Again is clicked', async () => {
    const character = createCharactersResponse().results[0];
    mockedGetCharacterDetails
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce(character);

    render(<CharacterDetails detailsId={1} />);

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(await screen.findByText(character.name)).toBeInTheDocument();
    expect(mockedGetCharacterDetails).toHaveBeenCalledTimes(2);
  });

  it('wraps non-Error rejections in Error', async () => {
    mockedGetCharacterDetails.mockRejectedValue('boom');

    render(<CharacterDetails detailsId={1} />);

    expect(await screen.findByText('boom')).toBeInTheDocument();
  });

  it('refetches when detailsId changes', async () => {
    const [first, second] = createCharactersResponse().results;
    mockedGetCharacterDetails
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);

    const { rerender } = render(<CharacterDetails detailsId={1} />);

    expect(await screen.findByText(first.name)).toBeInTheDocument();

    rerender(<CharacterDetails detailsId={2} />);

    expect(await screen.findByText(second.name)).toBeInTheDocument();
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(1);
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(2);
  });
});
