import { type CharacterResponse } from '../../../api/character';

export interface CharacterDetailsState {
  characterDetails: CharacterResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
}

export const initialState: CharacterDetailsState = {
  characterDetails: null,
  charactersIsLoading: false,
  charactersIsError: null,
};

export const CharacterDetailsActionTypes = {
  LOAD_START: 'LOAD_START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
} as const;

export type CharacterDetailsAction =
  | { type: typeof CharacterDetailsActionTypes.LOAD_START }
  | {
      type: typeof CharacterDetailsActionTypes.LOAD_SUCCESS;
      payload: CharacterResponse;
    }
  | { type: typeof CharacterDetailsActionTypes.LOAD_ERROR; payload: Error };

export const characterDetailsReducer = (
  state: CharacterDetailsState,
  action: CharacterDetailsAction
): CharacterDetailsState => {
  switch (action.type) {
    case CharacterDetailsActionTypes.LOAD_START:
      return {
        ...state,
        characterDetails: null,
        charactersIsLoading: true,
        charactersIsError: null,
      };
    case CharacterDetailsActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        characterDetails: action.payload,
        charactersIsLoading: false,
      };
    case CharacterDetailsActionTypes.LOAD_ERROR:
      return {
        ...state,
        characterDetails: null,
        charactersIsLoading: false,
        charactersIsError: action.payload,
      };
    default:
      return state;
  }
};
