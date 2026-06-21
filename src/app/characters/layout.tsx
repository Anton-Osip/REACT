import type { FC, ReactNode } from 'react';

import { clsx } from 'clsx';

type Props = {
  list: ReactNode;
  details: ReactNode;
};

const CharactersLayout: FC<Props> = ({ list, details }) => {
  return (
    <>
      <div className={clsx('min-h-0 flex-1 py-4', details && 'grid grid-cols-2 gap-4')}>
        {list}
        {details}
      </div>
    </>
  );
};

export default CharactersLayout;
