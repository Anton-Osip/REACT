import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import type { CharacterPreview } from '@/features/character/api';
import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';
import mockImage from '@/shared/assets/image/errorPageImage.png';

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

const baseCharacter: CharacterPreview = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: mockImage,
  location: { name: 'Earth', url: '' },
  gender: 'Male',
};

function resetStore() {
  useSelectedCharacterStore.setState({ selectedCharactersMap: null });
}

function renderCard(overrides: Partial<CharacterCardProps> = {}) {
  const { character: characterOverride, ...rest } = overrides;

  return render(
    <CharacterCard
      character={{ ...baseCharacter, ...characterOverride }}
      {...rest}
    />
  );
}

describe('CharacterCard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetStore();
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
      character: {
        ...baseCharacter,
        name: 'Morty Smith',
      },
    });

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText('Earth')).toBeInTheDocument();
  });

  it('displays character with Alive status correctly', () => {
    renderCard({
      character: {
        ...baseCharacter,
        name: 'Birdperson',
        species: 'Bird Person',
        location: { name: 'Bird World', url: '' },
      },
    });

    expect(screen.getByText('Alive - Bird Person')).toBeInTheDocument();
  });

  it('displays character with Dead status correctly', () => {
    renderCard({
      character: {
        ...baseCharacter,
        name: 'Mr. Poopybutthole',
        status: 'Dead',
        species: 'Unknown',
      },
    });

    expect(screen.getByText('Dead - Unknown')).toBeInTheDocument();
  });

  it('displays character with unknown status correctly', () => {
    renderCard({
      character: {
        ...baseCharacter,
        name: 'Evil Morty',
        status: 'unknown',
        location: { name: 'Citadel of Ricks', url: '' },
      },
    });

    expect(screen.getByText('unknown - Human')).toBeInTheDocument();
  });

  it('displays different species correctly', () => {
    const { rerender } = renderCard({
      character: {
        ...baseCharacter,
        name: 'Character',
        species: 'Alien',
        location: { name: 'Space', url: '' },
      },
    });

    expect(screen.getByText('Alive - Alien')).toBeInTheDocument();

    rerender(
      <CharacterCard
        character={{
          ...baseCharacter,
          name: 'Character',
          species: 'Robot',
          location: { name: 'Space', url: '' },
        }}
      />
    );

    expect(screen.getByText('Alive - Robot')).toBeInTheDocument();
  });

  it('displays location name correctly', () => {
    renderCard({
      character: {
        ...baseCharacter,
        name: 'Jerry Smith',
        location: { name: 'Jerryboree', url: '' },
      },
    });

    expect(screen.getByText('Jerryboree')).toBeInTheDocument();
  });

  it('handles long names without breaking', () => {
    const longName =
      'This is a very very long character name that should not break the layout';
    renderCard({
      character: {
        ...baseCharacter,
        name: longName,
      },
    });

    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles long location names without breaking', () => {
    const longLocation =
      'This is a very very long location name that should not break the layout';
    renderCard({
      character: {
        ...baseCharacter,
        name: 'Test Character',
        location: { name: longLocation, url: '' },
      },
    });

    expect(screen.getByText(longLocation)).toBeInTheDocument();
  });

  it('calls toggleCharacterSelected when star button is clicked', async () => {
    renderCard();

    const [selectButton] = screen.getAllByRole('button');
    await user.click(selectButton);

    expect(
      useSelectedCharacterStore
        .getState()
        .selectedCharactersMap?.has(baseCharacter.id)
    ).toBe(true);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('navigates to character details when card is clicked', async () => {
    renderCard({
      character: { ...baseCharacter, id: 42 },
    });

    await user.click(screen.getByRole('img', { name: 'Rick Sanchez' }));

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/character/$id',
      params: { id: '42' },
      search: expect.any(Function),
    });
    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap?.has(42)
    ).toBeFalsy();
  });

  it('marks star button as selected when character is in store', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(baseCharacter);
    renderCard();

    const [selectButton] = screen.getAllByRole('button');
    expect(selectButton.className).toMatch(/isSelected/);
  });
});
