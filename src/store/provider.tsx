'use client';

import { FC, ReactNode, useState } from 'react';

import { Provider } from 'react-redux';

import { makeStore } from './store';

type Props = { children: ReactNode };

export const StoreProvider: FC<Props> = ({ children }) => {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
};
