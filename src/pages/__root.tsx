import { Outlet, createRootRoute } from '@tanstack/react-router';

import { ErrorBoundary } from '@/features/error-boundary';
import { Header } from '@/widgets/header';

import { NotFoundPage } from './not-found/not-found-page';

import s from './root.module.css';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <ErrorBoundary>
      <Header />
      <main className={s.main}>
        <Outlet />
      </main>
    </ErrorBoundary>
  );
}
