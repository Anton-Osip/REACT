import { Outlet, createRootRoute } from '@tanstack/react-router';

import { ErrorBoundary } from '@/features/error-boundary';
import { ThemeProvider } from '@/features/theme';
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
      <ThemeProvider>
        <Header />
        <main className={s.main}>
          <Outlet />
        </main>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
