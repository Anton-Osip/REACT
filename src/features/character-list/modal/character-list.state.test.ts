import { describe, expect, it } from 'vitest';
import type { CharactersResponse } from '../../../api/character';
import {
  CharacterListActionTypes,
  characterListReducer,
  type CharacterListState,
} from './character-list.state';
import { initialState } from '../ui/character-list.tsx';

const mockCharactersResponse: CharactersResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: 'https://example.com/origin' },
      location: { name: 'Earth', url: 'https://example.com/location' },
      image: 'https://example.com/rick.png',
      episode: ['https://example.com/episode/1'],
      url: 'https://example.com/character/1',
      created: '2017-11-04T18:48:46.250Z',
    },
  ],
};

describe('character-list.state', () => {
  describe('initialState', () => {
    it('has empty data and no loading or error flags', () => {
      expect(initialState).toEqual({
        characters: null,
        charactersIsLoading: false,
        charactersIsError: null,
        shouldThrowError: false,
      });
    });
  });

  describe('characterListReducer', () => {
    it('returns initial state for LOAD_START', () => {
      const prevState: CharacterListState = {
        ...initialState,
        characters: mockCharactersResponse,
        charactersIsError: new Error('previous'),
        shouldThrowError: true,
      };

      const nextState = characterListReducer(prevState, {
        type: CharacterListActionTypes.LOAD_START,
      });

      expect(nextState).toEqual({
        characters: null,
        charactersIsLoading: true,
        charactersIsError: null,
        shouldThrowError: true,
      });
    });

    it('stores payload and stops loading on LOAD_SUCCESS', () => {
      const prevState: CharacterListState = {
        ...initialState,
        charactersIsLoading: true,
        charactersIsError: new Error('stale'),
        shouldThrowError: true,
      };

      const nextState = characterListReducer(prevState, {
        type: CharacterListActionTypes.LOAD_SUCCESS,
        payload: mockCharactersResponse,
      });

      expect(nextState).toEqual({
        characters: mockCharactersResponse,
        charactersIsLoading: false,
        charactersIsError: new Error('stale'),
        shouldThrowError: true,
      });
    });

    it('clears characters and stores error on LOAD_ERROR', () => {
      const error = new Error('Network failed');
      const prevState: CharacterListState = {
        ...initialState,
        characters: mockCharactersResponse,
        charactersIsLoading: true,
        shouldThrowError: true,
      };

      const nextState = characterListReducer(prevState, {
        type: CharacterListActionTypes.LOAD_ERROR,
        payload: error,
      });

      expect(nextState).toEqual({
        characters: null,
        charactersIsLoading: false,
        charactersIsError: error,
        shouldThrowError: true,
      });
    });

    it('sets shouldThrowError on SIMULATE_ERROR', () => {
      const prevState: CharacterListState = {
        ...initialState,
        characters: mockCharactersResponse,
        charactersIsLoading: true,
        charactersIsError: new Error('existing'),
      };

      const nextState = characterListReducer(prevState, {
        type: CharacterListActionTypes.SIMULATE_ERROR,
      });

      expect(nextState).toEqual({
        characters: mockCharactersResponse,
        charactersIsLoading: true,
        charactersIsError: new Error('existing'),
        shouldThrowError: true,
      });
    });

    it('returns current state for unknown action', () => {
      const prevState: CharacterListState = {
        ...initialState,
        characters: mockCharactersResponse,
      };

      const nextState = characterListReducer(prevState, {
        type: 'UNKNOWN' as typeof CharacterListActionTypes.LOAD_START,
      });

      expect(nextState).toBe(prevState);
    });
  });
});
