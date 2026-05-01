import { Component } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { type CharactersResponse, getCharacters } from '../../api/character';
import { CharacterCard } from './character-card';

interface CharacterListProps {
  className?: string;
  searchName?: string;
}

interface CharacterListState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: boolean;
}

export class CharacterList extends Component<
  CharacterListProps,
  CharacterListState
> {
  constructor(props: CharacterListProps) {
    super(props);
    this.state = {
      characters: null,
      charactersIsLoading: false,
      charactersIsError: false,
    };
  }

  async componentDidMount() {
    await this.loadCharacters(this.props.searchName);
  }

  async componentDidUpdate(prevProps: CharacterListProps) {
    if (prevProps.searchName !== this.props.searchName) {
      await this.loadCharacters(this.props.searchName);
    }
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

  render() {
    const { className } = this.props;
    const { characters } = this.state;

    return (
      <div className={clsx(s.characterList, className)}>
        {characters && characters.results.length !== 0 && (
          <div className={s.grid}>
            {characters.results.map((character) => (
              <CharacterCard
                key={character.id}
                image={character.image}
                name={character.name}
                species={character.species}
                location={character.location.name}
                status={character.status}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
