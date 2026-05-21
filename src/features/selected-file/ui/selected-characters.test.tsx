import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { SelectedCharacters } from './selected-characters.tsx';
import { useCharacterListStore } from '../../character-list/modal/character-list.state';
import { createCharactersResponse } from '../../../test-utils';
import type { Character } from '../../../api/character/getCharacters.type';

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockCharacter = createCharactersResponse().results[0];
const mockMorty = createCharactersResponse().results[1];

function resetStore() {
  useCharacterListStore.setState({
    characters: null,
    charactersIsLoading: false,
    charactersIsError: null,
    shouldThrowError: false,
    selectedCharacterIds: null,
  });
}

function selectCharacters(...characters: Character[]) {
  for (const character of characters) {
    useCharacterListStore.getState().toggleCharacterSelected(character);
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

  it('renders panel in document body when characters are selected', () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    expect(screen.getByText('Selected characters ( 1 )')).toBeInTheDocument();
    expect(getPanelElement().parentElement).toBe(document.body);
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
      screen.getByRole('button', { name: 'Download CSV' })
    ).toBeInTheDocument();
  });

  it('clears selection when Reset is clicked', async () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(useCharacterListStore.getState().selectedCharacterIds).toBeNull();
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

  it('toggles open state when header is clicked', async () => {
    selectCharacters(mockCharacter);
    render(<SelectedCharacters />);

    const panel = getPanelElement();
    expect(panel.className).toMatch(/isOpen/);

    await user.click(screen.getByText('Selected characters ( 1 )'));

    expect(panel.className).not.toMatch(/isOpen/);
  });

  it('removes character from selection when star is toggled in carousel', async () => {
    selectCharacters(mockCharacter, mockMorty);
    render(<SelectedCharacters />);

    const carousel = getCarouselElement();
    const [, mortySelectButton] = within(carousel).getAllByRole('button');

    await user.click(mortySelectButton);

    expect(useCharacterListStore.getState().selectedCharacterIds?.size).toBe(1);
    expect(screen.getByText('Selected characters ( 1 )')).toBeInTheDocument();
    expect(within(carousel).queryByText('Morty Smith')).not.toBeInTheDocument();
  });

  describe('CSV download', () => {
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let anchorClickSpy: ReturnType<typeof vi.fn<() => void>>;
    let downloadLink: HTMLAnchorElement | null;

    beforeEach(() => {
      downloadLink = null;
      anchorClickSpy = vi.fn<() => void>();
      createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          downloadLink = element as HTMLAnchorElement;
          vi.spyOn(element, 'click').mockImplementation(anchorClickSpy);
        }
        return element;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('downloads CSV with filename based on selection count', async () => {
      selectCharacters(mockCharacter, mockMorty);
      render(<SelectedCharacters />);

      await user.click(screen.getByRole('button', { name: 'Download CSV' }));

      expect(downloadLink?.download).toBe('2_characters.csv');
      expect(anchorClickSpy).toHaveBeenCalledOnce();
      expect(createObjectURLSpy).toHaveBeenCalledOnce();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('creates a CSV blob containing selected character data', async () => {
      selectCharacters(mockCharacter);
      render(<SelectedCharacters />);

      await user.click(screen.getByRole('button', { name: 'Download CSV' }));

      const blob = createObjectURLSpy.mock.calls[0]?.[0] as Blob;
      const csvText = await blob.text();

      expect(csvText).toContain('Rick Sanchez');
      expect(csvText).toContain('Character URL');
      expect(createObjectURLSpy.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
    });
  });
});
