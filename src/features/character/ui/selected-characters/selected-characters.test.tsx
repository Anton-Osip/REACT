import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import { SelectedCharacters } from '@/features/character';
import type { CharacterPreview } from '@/features/character/api';
import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';
import { toCharacterPreview } from '@/features/character/model/toCharacterPreview.ts';
import { createCharactersResponse } from '@/shared/test-utils';

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockCharacter = toCharacterPreview(createCharactersResponse().results[0]);
const mockMorty = toCharacterPreview(createCharactersResponse().results[1]);

function resetStore() {
  useSelectedCharacterStore.setState({ selectedCharactersMap: null });
}

function selectCharacters(...characters: CharacterPreview[]) {
  for (const character of characters) {
    useSelectedCharacterStore.getState().toggleCharacterSelected(character);
  }
}

function getPanelElement(): HTMLElement {
  const panel = document.body.querySelector('[class*="selectedCharacters"]');

  if (!panel) {
    throw new Error('Selection panel not found');
  }

  return panel as HTMLElement;
}

function getCarouselElement(
  panel: HTMLElement = getPanelElement()
): HTMLElement {
  const carousel = panel.querySelector('[class*="caruselWrapper"]');

  if (!carousel) {
    throw new Error('Selection panel carousel not found');
  }

  return carousel as HTMLElement;
}

describe('SelectedCharacters', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetStore();
    navigateMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not render panel when no characters are selected', () => {
    render(<SelectedCharacters />);

    expect(screen.queryByText(/Selected characters/i)).not.toBeInTheDocument();
    expect(
      document.body.querySelector('[class*="selectedCharacters"]')
    ).toBeNull();
  });

  it('renders panel when characters are selected', () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    expect(screen.getByText('Selected characters ( 1 )')).toBeInTheDocument();
    expect(getPanelElement()).toBeInTheDocument();
  });

  it('displays the number of selected characters', () => {
    selectCharacters(mockCharacter, mockMorty);
    render(<SelectedCharacters />);

    expect(screen.getByText('Selected characters ( 2 )')).toBeInTheDocument();
  });

  it('shows Reset and Download CSV action buttons', () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Download CSV' })
    ).toBeInTheDocument();
  });

  it('clears selection when Reset is clicked', async () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap
    ).toBeNull();
    expect(screen.queryByText(/Selected characters/i)).not.toBeInTheDocument();
  });

  it('renders selected characters in the carousel', () => {
    selectCharacters(mockCharacter, mockMorty);
    render(<SelectedCharacters />);

    const carousel = getCarouselElement();

    expect(within(carousel).getByText('Rick Sanchez')).toBeInTheDocument();
    expect(within(carousel).getByText('Morty Smith')).toBeInTheDocument();
  });

  it('applies panel layout class for the sticky bar', () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    expect(getPanelElement().className).toMatch(/selectedCharacters/);
  });

  it('removes character from selection when star is toggled in carousel', async () => {
    selectCharacters(mockCharacter, mockMorty);
    render(<SelectedCharacters />);

    const carousel = getCarouselElement();
    const [, mortySelectButton] = within(carousel).getAllByRole('button');

    await user.click(mortySelectButton);

    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap?.size
    ).toBe(1);
    expect(screen.getByText('Selected characters ( 1 )')).toBeInTheDocument();
    expect(within(carousel).queryByText('Morty Smith')).not.toBeInTheDocument();
  });

  describe('CSV download', () => {
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('downloads CSV with filename based on selection count', () => {
      selectCharacters(mockCharacter, mockMorty);
      render(<SelectedCharacters />);

      const downloadLink = screen.getByRole('link', { name: 'Download CSV' });

      expect(downloadLink).toHaveAttribute('download', '2_characters.csv');
      expect(downloadLink).toHaveAttribute('href', 'blob:mock-url');
      expect(createObjectURLSpy).toHaveBeenCalledOnce();
    });

    it('creates a CSV blob containing selected character data', async () => {
      selectCharacters(mockCharacter);
      render(<SelectedCharacters />);

      const blob = createObjectURLSpy.mock.calls[0]?.[0] as Blob;
      const csvText = await blob.text();

      expect(csvText).toContain('Rick Sanchez');
      expect(csvText).toContain('Image URL');
      expect(blob).toBeInstanceOf(Blob);
    });

    it('revokes blob URL on unmount', () => {
      selectCharacters(mockCharacter);
      const { unmount } = render(<SelectedCharacters />);

      unmount();

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
