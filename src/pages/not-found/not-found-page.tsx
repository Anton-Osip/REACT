import { Link } from '@tanstack/react-router';

import { Button, Typography } from '@/components';

import errorPageImage from '../../assets/image/errorPageImage.png';

import s from './not-found-page.module.css';

export function NotFoundPage() {
  return (
    <div className={s.error}>
      <div className={s.errorContent}>
        <Typography variant="h2" className={s.errorTitle}>
          404 — Page not found
        </Typography>
        <img
          className={s.errorPageImage}
          src={errorPageImage}
          alt="page not found"
        />
        <Typography variant="body2" className={s.errorMessage}>
          The page you are looking for does not exist.
        </Typography>
        <Button
          as={Link}
          to="/character"
          variant="secondary"
          className={s.resetButton}
          fullWidth
        >
          Back to characters
        </Button>
      </div>
    </div>
  );
}
