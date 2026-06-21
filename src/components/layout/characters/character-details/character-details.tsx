'use client';
import { type FC, type ReactNode } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { getGenderIcon, getSpeciesIcon, getStatusIcon } from '../character-icons';

import { ROUTES } from '@/constants';
import { Button, MapPinIcon, QueueIcon, Typography, XCircleIcon } from '@components/common';
import { type Character } from '@services/character';

const articleClassName =
  'characters-card relative flex h-fit max-h-full w-full flex-col self-start overflow-y-auto rounded-xl p-4';

type CharacterDetailsProps = {
  className?: string;
  details?: Character;
};

type DetailItemProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

const overlayButtonClassName =
  'flex h-8 w-8 items-center justify-center rounded-full bg-surface-900/80 p-0 ' +
  'text-surface-100 shadow-sm backdrop-blur-sm enabled:hover:bg-surface-900';

const DetailItem: FC<DetailItemProps> = ({ label, value, icon }) => (
  <div
    className={
      'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-dashed ' +
      'border-foreground/15 py-3 last:border-b-0'
    }
  >
    <div className="flex items-center gap-2.5">
      <span className="shrink-0 text-brand-500">{icon}</span>
      <Typography variant="p" className="capitalize text-foreground/60">
        {label}
      </Typography>
    </div>
    <Typography variant="h4" className="min-w-0 truncate text-right font-semibold">
      {value}
    </Typography>
  </div>
);

export const CharacterDetails: FC<CharacterDetailsProps> = ({ className, details }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.toString();

  if (!details) {
    return null;
  }

  const refetch = (): void => {
    router.refresh();
  };

  return (
    <article className={clsx(articleClassName, className)}>
      <div className="relative mb-4 aspect-square w-full shrink-0 overflow-hidden rounded-lg">
        <Image
          src={details.image}
          alt={details.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        <Button
          variant="ghost"
          className={clsx(overlayButtonClassName, 'absolute top-3 right-3 z-10')}
          href={`${ROUTES.CHARACTERS}${query ? `?${query}` : ''}`}
          aria-label="Close details"
        >
          <XCircleIcon size={20} />
        </Button>
        <Button
          variant="ghost"
          className={clsx(overlayButtonClassName, 'absolute top-3 left-3 z-10')}
          aria-label="Refresh details"
          onClick={refetch}
        >
          <QueueIcon size={18} />
        </Button>
      </div>

      <Typography variant="h3" className="mb-4 text-center">
        {details.name}
      </Typography>

      <div className="w-full">
        <DetailItem label="gender" value={details.gender} icon={getGenderIcon(details.gender)} />
        <DetailItem label="status" value={details.status} icon={getStatusIcon(details.status)} />
        <DetailItem label="species" value={details.species} icon={getSpeciesIcon(details.species)} />
        <DetailItem label="location" value={details.location.name} icon={<MapPinIcon size={20} />} />
      </div>
    </article>
  );
};
