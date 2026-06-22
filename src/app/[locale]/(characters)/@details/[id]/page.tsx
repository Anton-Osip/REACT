import type { FC } from 'react';

import { getCharacterById } from '@/services';
import { CharacterDetails } from '@components/layout';

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const details = await getCharacterById({ id });

  return <CharacterDetails details={details} />;
};

export default Page;
