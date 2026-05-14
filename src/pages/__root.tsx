import { Outlet, createRootRoute } from '@tanstack/react-router';
import s from './root.module.css';
import { ErrorBoundary } from '../features/error-boundary';
import { Container } from '../components';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={s.app}>
      <ErrorBoundary>
        <Container className={s.container}>
          <Outlet />
        </Container>
      </ErrorBoundary>
    </div>
  );
}
