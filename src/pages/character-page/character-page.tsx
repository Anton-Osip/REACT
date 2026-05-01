import { Component } from 'react';
import s from './character-page.module.css';
import { SearchForm } from '../../features/search-form';
import { type CharactersResponse, getCharacters } from '../../api/character';

interface CharacterPageState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: boolean;
}

export class CharacterPage extends Component<
  Record<string, never>,
  CharacterPageState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      characters: null,
      charactersIsLoading: false,
      charactersIsError: false,
    };
  }

  async componentDidMount() {
    await this.loadCharacters();
  }

  loadCharacters = async (name?: string) => {
    this.setState({
      characters: null,
      charactersIsLoading: true,
      charactersIsError: false,
    });

    try {
      const res = await getCharacters(name);
      this.setState({
        characters: res,
        charactersIsLoading: false,
      });
    } catch {
      this.setState({
        characters: null,
        charactersIsLoading: false,
        charactersIsError: true,
      });
    }
  };

  searchCharactersByName = async (value: string): Promise<void> => {
    if (value.trim() === '') return;
    await this.loadCharacters(value);
  };

  render() {
    return (
      <div className={s.characterPage}>
        <SearchForm submitInput={this.searchCharactersByName} />
      </div>
    );
  }
}
