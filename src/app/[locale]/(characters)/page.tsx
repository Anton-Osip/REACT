import type { FC } from 'react';

import { redirect } from 'next/navigation';

const Page: FC = () => {
  redirect('/en');
};

export default Page;
