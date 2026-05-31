import type { FC } from 'react';

import clsx from 'clsx';

import { FormRhf } from '@/features/forms/ui/form-rhf/form-rhf.tsx';
import { FormUncontrolled } from '@/features/forms/ui/form-uncontrolled/form-uncontrolled.tsx';
import { Button } from '@/shared/ui';
import { ModalForm } from '@/widgets/modal-form';

import s from './form-section.module.css';

type Props = {
  className?: string;
};

export const FormSection: FC<Props> = ({ className }) => {
  return (
    <div className={clsx(s.formSection, className)}>
      <ModalForm
        trigger={<Button fullWidth>Uncontrolled</Button>}
        title={'Uncontrolled'}
      >
        <FormUncontrolled />
      </ModalForm>

      <ModalForm
        trigger={
          <Button fullWidth variant={'secondary'}>
            React Hook Form
          </Button>
        }
        title={'React Hook Form'}
      >
        <FormRhf />
      </ModalForm>
    </div>
  );
};
