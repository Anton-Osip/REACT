import { PureComponent } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { type CharactersResponse, getCharacters } from '../../api/character';
import { CharacterCard } from './character-card';
import { Button, Skeleton, Typography } from '../../components';
import emptyPageImage from '../../assets/image/emptyPageImage.png';
interface CharacterListProps {
  className?: string;
  searchName?: string;
}

interface CharacterListState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
}

const SKELETON_COUNT = 20;

export class CharacterList extends PureComponent<
  CharacterListProps,
  CharacterListState
> {
  constructor(props: CharacterListProps) {
    super(props);
    this.state = {
      characters: null,
      charactersIsLoading: false,
      charactersIsError: null,
    };
  }

  async componentDidMount() {
    await this.loadCharacters(this.props.searchName);
  }

  async componentDidUpdate(prevProps: CharacterListProps) {
    if (prevProps.searchName !== this.props.searchName) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.loadCharacters(this.props.searchName);
    }
  }

  loadCharacters = async (name?: string) => {
    this.setState({
      characters: null,
      charactersIsLoading: true,
      charactersIsError: null,
    });

    try {
      const res = await getCharacters(name);
      this.setState({
        characters: res,
        charactersIsLoading: false,
      });
    } catch (error) {
      this.setState({
        characters: null,
        charactersIsLoading: false,
        charactersIsError:
          error instanceof Error ? error : new Error(String(error)),
      });
    }
  };

  render() {
    const { className } = this.props;
    const { characters, charactersIsLoading, charactersIsError } = this.state;

    const renderError = () => (
      <div className={s.error}>
        <Typography variant="h3">Something went wrong</Typography>
        <Typography>{this.state.charactersIsError?.message}</Typography>
        <button onClick={() => this.loadCharacters(this.props.searchName)}>
          Try again
        </button>
      </div>
    );

    const renderEmpty = () => (
      <div className={s.empty}>
        <img className={s.emptyImage} src={emptyPageImage} alt="empty page" />
        <Typography className={s.emptyText} variant={'h3'}>
          Nothing found.
        </Typography>
      </div>
    );

    const renderLoading = () => (
      <div className={s.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );

    const renderContent = () => (
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

    return (
      <>
        {charactersIsError && renderError()}
        {!characters && !charactersIsLoading && renderEmpty()}
        {!characters && charactersIsLoading && renderLoading()}
        {characters && renderContent()}
        <Button variant={'secondary'} className={s.button}>
          Error Button
        </Button>
      </>
    );
  }
}
