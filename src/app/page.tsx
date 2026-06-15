import { type FC } from 'react';

import { getCharacters } from '@/services';
import { CharactersPage } from '@components/layout';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export const dynamic = 'force-dynamic';

const Home: FC<Props> = async ({ searchParams }) => {
  const { search, page } = await searchParams;

  const result = await getCharacters({ search, page });

  return <CharactersPage initialData={result} />;
};

export default Home;
