import { Component } from 'react';
import s from './character-page.module.css';
import { SearchForm, STORAGE_KEY } from '../../features/search-form';
import { CharacterList } from '../../features/character-list';
import { loadFromStorage } from '../../utils';
import { ErrorBoundary } from '../../features/error-boundary';

interface CharacterPageState {
  searchName: string;
}

export class CharacterPage extends Component<
  Record<string, never>,
  CharacterPageState
> {
  constructor(props: Record<string, never>) {
    super(props);
    const searchName = loadFromStorage<string>(STORAGE_KEY, '');
    this.state = {
      searchName: searchName,
    };
  }

  searchCharactersByName = (value: string): void => {
    this.setState({ searchName: value });
  };

  render() {
    return (
      <div className={s.characterPage}>
        <SearchForm
          submitInput={this.searchCharactersByName}
          defaultValue={this.state.searchName}
        />
        <ErrorBoundary>
          <CharacterList searchName={this.state.searchName} />
        </ErrorBoundary>
      </div>
    );
  }
}
