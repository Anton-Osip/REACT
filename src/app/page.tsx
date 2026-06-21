import { type FC } from 'react';

import { CharactersFilter } from '@components/layout';

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const Home: FC<Props> = async ({ searchParams }) => {
  const { search } = await searchParams;

  return (
    <>
      <CharactersFilter defaultValue={search} />
      <div>characters</div>
    </>
  );
};

export default Home;
