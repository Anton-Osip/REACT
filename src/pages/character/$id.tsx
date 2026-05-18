import { createFileRoute } from '@tanstack/react-router';
import { CharacterDetails } from '../../features/character-details';

export const Route = createFileRoute('/character/$id')({
  component: CharacterDetails,
});
