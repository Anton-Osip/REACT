import type { FC } from 'react';

import clsx from 'clsx';

import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { SubmissionCard } from '@/features/forms/ui/submission-card';
import { EmptyComponent } from '@/widgets/empty';

import s from './submissions-list.module.css';

type Props = { classNames?: string };

export const SubmissionsList: FC<Props> = ({ classNames }) => {
  const { submissions, lastAddedCardId } = useFormsStore();

  const isListEmpty = submissions.length === 0;

  if (isListEmpty) {
    return <EmptyComponent />;
  }

  return (
    <div className={clsx(s.submissionsList, classNames)}>
      {submissions.map((s) => (
        <SubmissionCard
          key={s.id}
          submission={s}
          isHighlighted={lastAddedCardId === s.id}
        />
      ))}
    </div>
  );
};
