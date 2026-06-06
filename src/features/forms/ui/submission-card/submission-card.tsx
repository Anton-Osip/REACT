import type { FC } from 'react';

import clsx from 'clsx';

import type { UserCard } from '@/features/forms/model/forms.types.ts';
import {
  FORM_VARIANT_LABELS,
  formatGender,
  formatSubmittedAt,
} from '@/features/forms/model/submission.format.ts';
import { DetailRow } from '@/features/forms/ui/submission-card/detail-row';
import { Typography } from '@/shared/ui';

import s from './submission-card.module.css';

type Props = { classNames?: string; submission: UserCard };

export const SubmissionCard: FC<Props> = ({ classNames, submission }) => {
  return (
    <div className={clsx(s.submissionsCard, classNames)}>
      <div className={s.imageWrapper}>
        <img className={s.image} src={submission.image} alt={submission.name} />
      </div>
      <div className={s.content}>
        <div className={s.header}>
          <Typography className={s.name} variant="h2">
            {submission.name}
          </Typography>
          <Typography className={s.email} variant="body2">
            {submission.email}
          </Typography>
        </div>

        <div className={s.details}>
          <DetailRow label="Age" value={submission.age} />
          <DetailRow label="Gender" value={formatGender(submission.gender)} />
          <DetailRow label="Country" value={submission.country} />
          <DetailRow
            label="Terms accepted"
            value={submission.termsAccepted ? 'Yes' : 'No'}
          />
        </div>

        <div className={s.footer}>
          <span className={s.badge}>
            {FORM_VARIANT_LABELS[submission.formVariant]}
          </span>
          <Typography className={s.submittedAt} variant="caption">
            {formatSubmittedAt(submission.submittedAt)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
