import { type FC } from 'react';

import { FormSection, SubmissionsList } from '@/features/forms';
import { Container } from '@/shared/ui';

import s from './forms-page.module.css';

export const FormsPage: FC = () => {
  return (
    <div className={s.forms}>
      <Container className={s.container}>
        <FormSection />
        <SubmissionsList />
      </Container>
    </div>
  );
};
