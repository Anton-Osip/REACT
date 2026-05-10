import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CharacterCard } from './character-card.tsx';
import mockImage from '../../../assets/image/errorPageImage.png';

describe('CharacterCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Rick Sanchez"
        status="Alive"
        species="Human"
        location="Earth"
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('displays all character information correctly', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Morty Smith"
        status="Alive"
        species="Human"
        location="Earth"
      />
    );

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText('Earth')).toBeInTheDocument();
  });

  it('displays character with Alive status correctly', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Birdperson"
        status="Alive"
        species="Bird Person"
        location="Bird World"
      />
    );

    expect(screen.getByText('Alive - Bird Person')).toBeInTheDocument();
  });

  it('displays character with Dead status correctly', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Mr. Poopybutthole"
        status="Dead"
        species="Unknown"
        location="Earth"
      />
    );

    expect(screen.getByText('Dead - Unknown')).toBeInTheDocument();
  });

  it('displays character with unknown status correctly', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Evil Morty"
        status="unknown"
        species="Human"
        location="Citadel of Ricks"
      />
    );

    expect(screen.getByText('unknown - Human')).toBeInTheDocument();
  });

  it('displays different species correctly', () => {
    const { rerender } = render(
      <CharacterCard
        image={mockImage}
        name="Character"
        status="Alive"
        species="Alien"
        location="Space"
      />
    );

    expect(screen.getByText('Alive - Alien')).toBeInTheDocument();

    rerender(
      <CharacterCard
        image={mockImage}
        name="Character"
        status="Alive"
        species="Robot"
        location="Space"
      />
    );

    expect(screen.getByText('Alive - Robot')).toBeInTheDocument();
  });

  it('displays location name correctly', () => {
    render(
      <CharacterCard
        image={mockImage}
        name="Jerry Smith"
        status="Alive"
        species="Human"
        location="Jerryboree"
      />
    );

    expect(screen.getByText('Jerryboree')).toBeInTheDocument();
  });

  it('handles long names without breaking', () => {
    const longName =
      'This is a very very long character name that should not break the layout';
    render(
      <CharacterCard
        image={mockImage}
        name={longName}
        status="Alive"
        species="Human"
        location="Earth"
      />
    );

    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles long location names without breaking', () => {
    const longLocation =
      'This is a very very long location name that should not break the layout';
    render(
      <CharacterCard
        image={mockImage}
        name="Test Character"
        status="Alive"
        species="Human"
        location={longLocation}
      />
    );

    expect(screen.getByText(longLocation)).toBeInTheDocument();
  });
});
