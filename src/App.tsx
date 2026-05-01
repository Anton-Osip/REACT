import { Component } from 'react';
import s from './App.module.css';
import { CharacterPage } from './pages';
import { Container } from './components';

export class App extends Component {
  render() {
    return (
      <div className={s.app}>
        <Container className={s.container}>
          <CharacterPage />
        </Container>
      </div>
    );
  }
}
