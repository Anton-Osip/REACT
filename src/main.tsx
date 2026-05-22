import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import './styles/index.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
