import { type FC } from 'react';

import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

import { Button, Container } from '@/components';
import { ThemeToggle } from '@/features/theme';

import logoIcon from '../../assets/icon/logoIcon.svg';

import s from './header.module.css';

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
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
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
};
