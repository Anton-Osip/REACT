import clsx from 'clsx';
import { type FC } from 'react';
import s from './error.module.css';
import { Typography } from '../typography';
import errorPageImage from '../../assets/image/errorPageImage.png';
import { Button } from '../button';

interface ErrorProps {
  errorText?: string;
  isError: boolean | null;
  className?: string;
  tryAgain: () => void;
}

export const ErrorComponent: FC<ErrorProps> = ({
  errorText,
  isError,
  className,
  tryAgain,
}) => {
  if (!isError) return null;
  return (
    <div className={clsx(s.error, className)}>
      <div className={s.errorContent}>
        <Typography variant="h2" className={s.errorTitle}>
          Something went wrong
        </Typography>
        <img
          className={s.errorPageImage}
          src={errorPageImage}
          alt="error image"
        />
        <Typography variant="body2" className={s.errorMessage}>
          {errorText ?? 'An unexpected error occurred'}
        </Typography>
        <Button
          variant="secondary"
          onClick={tryAgain}
          className={s.resetButton}
          fullWidth
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
