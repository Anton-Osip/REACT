import type { FC } from 'react';

import { CharactersPage } from '@components/layout';

type Props = {
  searchParams: Promise<{ search: string }>;
};

const Default: FC<Props> = props => {
  return <CharactersPage {...props} />;
};

export default Default;
