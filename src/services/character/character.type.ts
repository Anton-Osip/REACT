export type CharactersResponse = {
  info: CharactersResponseInfo;
  results: Character[];
};

export type CharactersPreviewResponse = {
  info: CharactersResponseInfo;
  results: CharacterPreview[];
};

export type CharacterResponse = Character;
type CharactersResponseInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

export type Character = {
  id: number;
  name: string;
  status: CharacterStatusType;
  species: string;
  type: string;
  gender: CharacterGenderType;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type CharacterPreview = Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image' | 'location' | 'gender'>;

export const CharacterStatus = {
  Alive: 'Alive',
  Dead: 'Dead',
  unknown: 'unknown',
};
export const CharacterGender = {
  Female: 'Female',
  Male: 'Male',
  Genderless: 'Genderless',
  unknown: 'unknown',
};

export type CharacterStatusType = keyof typeof CharacterStatus;
export type CharacterGenderType = keyof typeof CharacterGender;

export type CharactersArgs = {
  name?: string;
  status?: CharacterStatusType;
  species?: string;
  type?: string;
  gender?: CharacterGenderType;
  page?: number;
};
