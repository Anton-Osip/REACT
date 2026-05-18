import { Outlet, createRootRoute } from '@tanstack/react-router';
import s from './root.module.css';
import { ErrorBoundary } from '../features/error-boundary';
import { Container, Header } from '../components';
import { NotFoundPage } from './not-found/not-found-page';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <>
      <Header />
      <div className={s.app}>
        <ErrorBoundary>
          <Container className={s.container}>
            <Outlet />
          </Container>
        </ErrorBoundary>
      </div>
    </>
  );
}
