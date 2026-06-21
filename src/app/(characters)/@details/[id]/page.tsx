import type { FC } from 'react';

import { CharacterDetails } from '@components/layout';
import { getCharacterById } from '@services/character/featchCharacter';

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const details = await getCharacterById({ id });

  return <CharacterDetails details={details} />;
};

export default Page;
