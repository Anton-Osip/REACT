import type { FC, ReactNode } from 'react';

import '../styles/globals.css';

type Props = {
  children: ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
  return children;
};

export default RootLayout;
