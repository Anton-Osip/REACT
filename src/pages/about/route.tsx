import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from './-about-page';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});
