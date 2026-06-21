import { type FC, type ReactNode } from 'react';

import clsx from 'clsx';
import { Image } from 'next/dist/client/image-component';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ROUTES } from '@/constants';
import {
  Button,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  PersonIcon,
  QuestionIcon,
  RobotIcon,
  SkullIcon,
  Typography,
} from '@components/common';
import type { CharacterPreview } from '@services/character';

type Props = {
  character: CharacterPreview;
  priority?: boolean;
};

const getStatusIcon = (status: CharacterPreview['status']): ReactNode => {
  switch (status) {
    case 'Dead':
      return <SkullIcon size={20} />;
    case 'unknown':
      return <QuestionIcon size={20} />;
    default:
      return <LinkIcon size={20} />;
  }
};

const getSpeciesIcon = (species: string): ReactNode => {
  if (species.toLowerCase() === 'human') {
    return <PersonIcon size={20} />;
  }

  return <RobotIcon size={20} />;
};

export const CharactersCard: FC<Props> = ({ character, priority = false }) => {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <Link
      className={clsx('character-card flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl p-3')}
      href={`${ROUTES.CHARACTERS}/${character.id}${query ? `?${query}` : ''}`}
    >
      <div className="relative mb-3 h-[200px] w-full shrink-0 overflow-hidden rounded-lg">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="294px"
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <Typography variant="h3" className="truncate">
          {character.name}
        </Typography>
        <Button aria-label="Add to favorites" variant={'ghost'}>
          <HeartIcon size={24} color="var(--color-brand-500)" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-brand-500">{getStatusIcon(character.status)}</span>
          <Typography variant="h4" className="truncate">
            {character.status}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-brand-500">{getSpeciesIcon(character.species)}</span>
          <Typography variant="h4" className="truncate">
            {character.species}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-brand-500">{<MapPinIcon size={20} />}</span>
          <Typography variant="h4" className="truncate">
            {character.location.name}
          </Typography>
        </div>
      </div>
    </Link>
  );
};
