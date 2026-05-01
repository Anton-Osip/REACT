import { Component } from 'react';
import s from './character-page.module.css';
import { Container } from '../../components';

export class CharacterPage extends Component {
  render() {
    return (
      <div className={s.characterPage}>
        <Container>input</Container>
        <Container className={s.gridContainer}>grid</Container>
      </div>
    );
  }
}
