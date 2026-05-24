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
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
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

export type CharacterPreview = Pick<
  Character,
  'id' | 'name' | 'status' | 'species' | 'image' | 'location' | 'gender'
>;

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';
