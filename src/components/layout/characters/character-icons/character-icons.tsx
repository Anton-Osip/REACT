import { type ReactNode } from 'react';

import {
  GenderFemaleIcon,
  GenderMaleIcon,
  LinkIcon,
  PersonIcon,
  QuestionIcon,
  RobotIcon,
  SkullIcon,
} from '@components/common';
import type { Character, CharacterPreview } from '@services/character';
import { CharacterGender, CharacterStatus } from '@services/character/character.type';

const ICON_SIZE = 20;

export const getGenderIcon = (gender: Character['gender']): ReactNode => {
  switch (gender) {
    case CharacterGender.Female:
      return <GenderFemaleIcon size={ICON_SIZE} />;
    case CharacterGender.Male:
      return <GenderMaleIcon size={ICON_SIZE} />;
    default:
      return <QuestionIcon size={ICON_SIZE} />;
  }
};

export const getStatusIcon = (status: CharacterPreview['status']): ReactNode => {
  switch (status) {
    case CharacterStatus.Dead:
      return <SkullIcon size={ICON_SIZE} />;
    case CharacterStatus.unknown:
      return <QuestionIcon size={ICON_SIZE} />;
    default:
      return <LinkIcon size={ICON_SIZE} />;
  }
};

export const getSpeciesIcon = (species?: string): ReactNode => {
  if (!species) {
    return <QuestionIcon size={ICON_SIZE} />;
  }

  if (species.toLowerCase() === 'human') {
    return <PersonIcon size={ICON_SIZE} />;
  }

  return <RobotIcon size={ICON_SIZE} />;
};
