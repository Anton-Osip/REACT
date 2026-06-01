import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';

import { AppProviders } from '@/app/providers';

import { routeTree } from '../../routeTree.gen.ts';

export async function renderWithRouter(initialLocation: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  });

  const view = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );

  await router.load();

  return {
    router,
    ...view,
  };
}
