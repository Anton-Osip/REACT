import type { Character, CharacterPreview } from '@/features/character/api';

export const toCharacterPreview = (character: Character): CharacterPreview => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  image: character.image,
  location: character.location,
  gender: character.gender,
});
