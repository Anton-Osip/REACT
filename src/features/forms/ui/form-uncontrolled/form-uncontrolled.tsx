import type { FC } from 'react';

import clsx from 'clsx';

import s from './form-uncontrolled.module.css';

type Props = {
  className?: string;
};

export const FormUncontrolled: FC<Props> = () => {
  return <div className={clsx(s.uncontrolledForms)}>UncontrolledForms</div>;
};
