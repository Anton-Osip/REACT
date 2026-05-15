import { Outlet, createRootRoute } from '@tanstack/react-router';
import s from './root.module.css';
import { ErrorBoundary } from '../features/error-boundary';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={s.app}>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
