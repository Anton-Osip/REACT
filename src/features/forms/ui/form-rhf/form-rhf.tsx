import type { FC } from 'react';

import clsx from 'clsx';

import s from './form-rhf.module.css';

type Props = {
  className?: string;
};

export const FormRhf: FC<Props> = ({ className }) => {
  return <div className={clsx(s.FormRhf, className)}>FormRhf</div>;
};
