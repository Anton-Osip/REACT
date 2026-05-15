import { describe, expect, it } from 'vitest';
import type { CharacterResponse } from '../../../api/character';
import {
  CharacterDetailsActionTypes,
  characterDetailsReducer,
  initialState,
  type CharacterDetailsState,
} from './character-details.state';

const mockCharacter: CharacterResponse = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: 'https://example.com/origin' },
  location: { name: 'Citadel of Ricks', url: 'https://example.com/location' },
  image: 'https://example.com/rick.png',
  episode: ['https://example.com/episode/1'],
  url: 'https://example.com/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

describe('character-details.state', () => {
  describe('initialState', () => {
    it('has no details and no loading or error flags', () => {
      expect(initialState).toEqual({
        characterDetails: null,
        charactersIsLoading: false,
        charactersIsError: null,
      });
    });
  });

  describe('characterDetailsReducer', () => {
    it('clears details, sets loading and clears error on LOAD_START', () => {
      const prevState: CharacterDetailsState = {
        ...initialState,
        characterDetails: mockCharacter,
        charactersIsError: new Error('previous'),
      };

      const nextState = characterDetailsReducer(prevState, {
        type: CharacterDetailsActionTypes.LOAD_START,
      });

      expect(nextState).toEqual({
        characterDetails: null,
        charactersIsLoading: true,
        charactersIsError: null,
      });
    });

    it('stores payload and stops loading on LOAD_SUCCESS', () => {
      const prevState: CharacterDetailsState = {
        ...initialState,
        charactersIsLoading: true,
        charactersIsError: new Error('stale'),
      };

      const nextState = characterDetailsReducer(prevState, {
        type: CharacterDetailsActionTypes.LOAD_SUCCESS,
        payload: mockCharacter,
      });

      expect(nextState).toEqual({
        characterDetails: mockCharacter,
        charactersIsLoading: false,
        charactersIsError: new Error('stale'),
      });
    });

    it('clears details and stores error on LOAD_ERROR', () => {
      const error = new Error('Network failed');
      const prevState: CharacterDetailsState = {
        ...initialState,
        characterDetails: mockCharacter,
        charactersIsLoading: true,
      };

      const nextState = characterDetailsReducer(prevState, {
        type: CharacterDetailsActionTypes.LOAD_ERROR,
        payload: error,
      });

      expect(nextState).toEqual({
        characterDetails: null,
        charactersIsLoading: false,
        charactersIsError: error,
      });
    });

    it('returns current state for unknown action', () => {
      const prevState: CharacterDetailsState = {
        ...initialState,
        characterDetails: mockCharacter,
      };

      const nextState = characterDetailsReducer(prevState, {
        type: 'UNKNOWN' as typeof CharacterDetailsActionTypes.LOAD_START,
      });

      expect(nextState).toBe(prevState);
    });
  });
});
