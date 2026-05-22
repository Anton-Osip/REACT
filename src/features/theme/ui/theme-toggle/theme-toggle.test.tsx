import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../modal/theme-context.tsx';
import { ThemeToggle } from './theme-toggle.tsx';

const MOON_PATH_FRAGMENT = 'M20.354';
const SUN_PATH_FRAGMENT = 'M12 3v1';

function getToggleIconPath() {
  const button = screen.getByRole('button', { name: 'Switch theme' });
  return button.querySelector('path')?.getAttribute('d') ?? '';
}

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('renders a theme switch button with accessible label', () => {
    localStorage.setItem('theme', JSON.stringify('light'));
    renderThemeToggle();

    expect(
      screen.getByRole('button', { name: 'Switch theme' })
    ).toBeInTheDocument();
  });

  it('shows moon icon in light mode and sun icon in dark mode', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));
    renderThemeToggle();

    expect(getToggleIconPath()).toContain(MOON_PATH_FRAGMENT);

    await user.click(screen.getByRole('button', { name: 'Switch theme' }));

    await waitFor(() => {
      expect(getToggleIconPath()).toContain(SUN_PATH_FRAGMENT);
    });
  });

  it('toggles document theme class when clicked', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));
    renderThemeToggle();

    expect(document.documentElement).toHaveClass('light');

    await user.click(screen.getByRole('button', { name: 'Switch theme' }));

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).not.toHaveClass('light');
    });

    await user.click(screen.getByRole('button', { name: 'Switch theme' }));

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light');
    });
  });
});
