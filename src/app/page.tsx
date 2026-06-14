import { FC, Suspense } from 'react';

import { CharactersPage } from '@components/layout';

const Home: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharactersPage />
    </Suspense>
  );
};

export default Home;
