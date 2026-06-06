import { type FC } from 'react';

import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

import { ErrorButton } from '@/features/error-button';
import { ThemeToggle } from '@/features/theme';
import logoIcon from '@/shared/assets/icon/logoIcon.svg';
import { Button, Container } from '@/shared/ui';

import s from './header.module.css';

type Props = {
  className?: string;
};

export const Header: FC<Props> = ({ className }) => {
  return (
    <header className={clsx(s.header, className)}>
      <Container className={s.container}>
        <Link
          to="/character"
          className={s.logoLink}
          search={{ search: undefined, page: 1 }}
        >
          <img src={logoIcon} alt="logo" className={s.logoIcon} />
        </Link>

        <nav className={s.nav}>
          <Button as={Link} to="/" variant="ghost" fullWidth>
            Home
          </Button>

          <Button as={Link} to="/about" variant="ghost" fullWidth>
            About
          </Button>
          <Button as={Link} to="/forms" variant="ghost" fullWidth>
            Forms
          </Button>
        </nav>
        <div className={s.controls}>
          <ErrorButton />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
};
