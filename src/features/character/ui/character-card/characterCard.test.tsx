import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import '@testing-library/jest-dom/vitest';
import type { CharacterPreview } from '@/features/character/api';
import {
  CHARACTER_CARD_FAVORITE_ACTION,
  CHARACTER_CARD_FAVORITE_ACTION_ATTRIBUTE,
} from '@/features/character/model/constants.ts';
import mockImage from '@/shared/assets/image/errorPageImage.png';

import { CharacterCard, type CharacterCardProps } from './character-card.tsx';

const baseCharacter: CharacterPreview = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: mockImage,
  location: { name: 'Earth', url: '' },
  gender: 'Male',
};

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

  it('renders favorite button by default', () => {
    renderCard();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('marks favorite button with delegated click action', () => {
    renderCard();

    expect(screen.getByRole('button')).toHaveAttribute(
      CHARACTER_CARD_FAVORITE_ACTION_ATTRIBUTE,
      CHARACTER_CARD_FAVORITE_ACTION
    );
  });

  it('marks favorite button as selected when isSelected is true', () => {
    renderCard({ isSelected: true });

    expect(screen.getByRole('button').className).toMatch(/isSelected/);
  });

  it('adds card id to root element for click delegation', () => {
    renderCard({ character: { ...baseCharacter, id: 42 } });

    const card = screen
      .getByRole('img', { name: 'Rick Sanchez' })
      .closest('[data-card-id]');

    expect(card).toHaveAttribute('data-card-id', '42');
  });
});
