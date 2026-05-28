import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { toCharacterPreview } from '@/features/character/model/toCharacterPreview.ts';
import { createCharactersResponse } from '@/shared/test-utils';

import { CharacterListGrid } from './character-list-grid.tsx';

describe('CharacterListGrid', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns null when characters array is empty', () => {
    const { container } = render(
      <CharacterListGrid characters={[]} selectedCharactersMap={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders a card for each character', () => {
    const characters =
      createCharactersResponse().results.map(toCharacterPreview);

    render(
      <CharacterListGrid characters={characters} selectedCharactersMap={null} />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
