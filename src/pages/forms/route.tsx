import { createFileRoute } from '@tanstack/react-router';

import { FormsPage } from '@/pages/forms/-forms-page.tsx';

export const Route = createFileRoute('/forms')({
  component: FormsPage,
});
