import { Component } from 'react';
import s from './character-page.module.css';
import { SearchForm } from '../../features/search-form';
import { CharacterList } from '../../features/character-list';

interface CharacterPageState {
  searchName: string;
}

export class CharacterPage extends Component<
  Record<string, never>,
  CharacterPageState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchName: '',
    };
  }

  searchCharactersByName = (value: string): void => {
    this.setState({ searchName: value });
  };

  render() {
    return (
      <div className={s.characterPage}>
        <SearchForm submitInput={this.searchCharactersByName} />
        <CharacterList searchName={this.state.searchName} />
      </div>
    );
  }
}
