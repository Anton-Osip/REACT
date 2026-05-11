import { type FC } from 'react';
import s from './App.module.css';
import { CharacterPage } from './pages';
import { Container } from './components';
import { ErrorBoundary } from './features/error-boundary';

export const App: FC = () => {
  return (
    <div className={s.app}>
      <ErrorBoundary>
        <Container className={s.container}>
          <CharacterPage />
        </Container>
      </ErrorBoundary>
    </div>
  );
};
