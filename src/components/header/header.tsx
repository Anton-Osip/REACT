import { type FC } from 'react';
import s from './header.module.css';
import clsx from 'clsx';
import { Container } from '../container';
import logoIcon from '../../assets/icon/logoIcon.svg';
import { Link } from '@tanstack/react-router';
import { Button } from '../button';

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
          <Button
            as={Link}
            to="/about"
            variant="ghost"
            className={s.resetButton}
            fullWidth
          >
            About
          </Button>
        </nav>
      </Container>
    </header>
  );
};
