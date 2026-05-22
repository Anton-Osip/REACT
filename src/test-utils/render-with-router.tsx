import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';

import { routeTree } from '../routeTree.gen';

export function renderWithRouter(initialLocation: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  });

  return {
    router,
    ...render(<RouterProvider router={router} />),
  };
}
