import { Outlet, createRootRoute } from '@tanstack/react-router';
import s from './root.module.css';
import { ErrorBoundary } from '../features/error-boundary';
import { useCharacterListStore } from '../features/character-list/modal/character-list.state';
import { Container, Header } from '../components';
import { NotFoundPage } from './not-found/not-found-page';
import { ThemeProvider } from '../features/theme';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <Header />
      <div className={s.app}>
        <ErrorBoundary
          onReset={() => useCharacterListStore.getState().resetSimulatedError()}
        >
          <Container className={s.container}>
            <Outlet />
          </Container>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}
