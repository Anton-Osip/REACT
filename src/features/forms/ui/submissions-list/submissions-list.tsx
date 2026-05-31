import type { FC } from 'react';

import clsx from 'clsx';

import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { SubmissionCard } from '@/features/forms/ui/submission-card';

import s from './submissions-list.module.css';

type Props = { classNames?: string };

export const SubmissionsList: FC<Props> = ({ classNames }) => {
  const { submissions } = useFormsStore();

  return (
    <div className={clsx(s.submissionsList, classNames)}>
      {submissions.map((s) => (
        <SubmissionCard key={s.id} submission={s} />
      ))}
    </div>
  );
};
