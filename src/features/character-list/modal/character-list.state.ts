import { type CharactersResponse } from '../../../api/character';

export interface CharacterListState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
  shouldThrowError: boolean;
}

export const initialState: CharacterListState = {
  characters: null,
  charactersIsLoading: false,
  charactersIsError: null,
  shouldThrowError: false,
};

export const CharacterListActionTypes = {
  LOAD_START: 'LOAD_START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
  SIMULATE_ERROR: 'SIMULATE_ERROR',
} as const;

export type CharacterListAction =
  | { type: typeof CharacterListActionTypes.LOAD_START }
  | {
      type: typeof CharacterListActionTypes.LOAD_SUCCESS;
      payload: CharactersResponse;
    }
  | { type: typeof CharacterListActionTypes.LOAD_ERROR; payload: Error }
  | { type: typeof CharacterListActionTypes.SIMULATE_ERROR };

export const characterListReducer = (
  state: CharacterListState,
  action: CharacterListAction
): CharacterListState => {
  switch (action.type) {
    case CharacterListActionTypes.LOAD_START:
      return {
        ...state,
        characters: null,
        charactersIsLoading: true,
        charactersIsError: null,
      };
    case CharacterListActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        characters: action.payload,
        charactersIsLoading: false,
      };
    case CharacterListActionTypes.LOAD_ERROR:
      return {
        ...state,
        characters: null,
        charactersIsLoading: false,
        charactersIsError: action.payload,
      };
    case CharacterListActionTypes.SIMULATE_ERROR:
      return {
        ...state,
        shouldThrowError: true,
      };
    default:
      return state;
  }
};
