import { createFileRoute } from '@tanstack/react-router';
import { CharacterPage } from './character/-character-page';

export const Route = createFileRoute('/')({
  component: CharacterPage,
});
