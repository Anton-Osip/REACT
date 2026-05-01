import { Component } from 'react';
import s from './App.module.css';
import { CharacterPage } from './pages';

export class App extends Component {
  render() {
    return (
      <div className={s.app}>
        <CharacterPage />
      </div>
    );
  }
}
