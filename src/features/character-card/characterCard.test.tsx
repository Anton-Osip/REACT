import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import mockImage from '../../assets/image/errorPageImage.png';

import { CharacterCard, type CharacterCardProps } from './character-card.tsx';

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const baseCardProps = {
  image: mockImage,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  location: 'Earth',
  id: 1,
  isSelected: false,
  toggleCharacterSelected: vi.fn(),
};

function renderCard(overrides: Partial<CharacterCardProps> = {}) {
  const toggleCharacterSelected = overrides.toggleCharacterSelected ?? vi.fn();

  return render(
    <CharacterCard
      {...baseCardProps}
      {...overrides}
      toggleCharacterSelected={toggleCharacterSelected}
    />
  );
}

describe('CharacterCard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    navigateMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    renderCard();

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('displays all character information correctly', () => {
    renderCard({
      name: 'Morty Smith',
    });

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText('Earth')).toBeInTheDocument();
  });

  it('displays character with Alive status correctly', () => {
    renderCard({
      name: 'Birdperson',
      species: 'Bird Person',
      location: 'Bird World',
    });

    expect(screen.getByText('Alive - Bird Person')).toBeInTheDocument();
  });

  it('displays character with Dead status correctly', () => {
    renderCard({
      name: 'Mr. Poopybutthole',
      status: 'Dead',
      species: 'Unknown',
    });

    expect(screen.getByText('Dead - Unknown')).toBeInTheDocument();
  });

  it('displays character with unknown status correctly', () => {
    renderCard({
      name: 'Evil Morty',
      status: 'unknown',
      location: 'Citadel of Ricks',
    });

    expect(screen.getByText('unknown - Human')).toBeInTheDocument();
  });

  it('displays different species correctly', () => {
    const { rerender } = renderCard({
      name: 'Character',
      species: 'Alien',
      location: 'Space',
    });

    expect(screen.getByText('Alive - Alien')).toBeInTheDocument();

    rerender(
      <CharacterCard
        {...baseCardProps}
        name="Character"
        species="Robot"
        location="Space"
        toggleCharacterSelected={vi.fn()}
      />
    );

    expect(screen.getByText('Alive - Robot')).toBeInTheDocument();
  });

  it('displays location name correctly', () => {
    renderCard({
      name: 'Jerry Smith',
      location: 'Jerryboree',
    });

    expect(screen.getByText('Jerryboree')).toBeInTheDocument();
  });

  it('handles long names without breaking', () => {
    const longName =
      'This is a very very long character name that should not break the layout';
    renderCard({ name: longName });

    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles long location names without breaking', () => {
    const longLocation =
      'This is a very very long location name that should not break the layout';
    renderCard({
      name: 'Test Character',
      location: longLocation,
    });

    expect(screen.getByText(longLocation)).toBeInTheDocument();
  });

  it('calls toggleCharacterSelected when star button is clicked', async () => {
    const toggleCharacterSelected = vi.fn();
    renderCard({ toggleCharacterSelected });

    const [selectButton] = screen.getAllByRole('button');
    await user.click(selectButton);

    expect(toggleCharacterSelected).toHaveBeenCalledTimes(1);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('navigates to character details when card is clicked', async () => {
    const toggleCharacterSelected = vi.fn();
    renderCard({ toggleCharacterSelected, id: 42 });

    await user.click(screen.getByRole('img', { name: 'Rick Sanchez' }));

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/character/$id',
      params: { id: '42' },
      search: expect.any(Function),
    });
    expect(toggleCharacterSelected).not.toHaveBeenCalled();
  });

  it('marks star button as selected when isSelected is true', () => {
    renderCard({ isSelected: true });

    const [selectButton] = screen.getAllByRole('button');
    expect(selectButton.className).toMatch(/isSelected/);
  });

  it('highlights card when selectCardId matches character id', () => {
    const { container } = renderCard({ selectCardId: '1' });

    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/selectedCard/);
  });
});
