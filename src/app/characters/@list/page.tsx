import type { FC } from 'react';

import { CharactersPage } from '@components/layout';

type Props = {
  searchParams: Promise<{ search: string; page: string }>;
};

const Page: FC<Props> = async props => {
  return <CharactersPage {...props} />;
};

export default Page;
