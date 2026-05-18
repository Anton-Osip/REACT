import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('Pagination', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when pages is 1', () => {
    const { container } = render(
      <Pagination pages={1} currentPage={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when pages is 0', () => {
    const { container } = render(
      <Pagination pages={0} currentPage={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders navigation landmark with accessible name', () => {
    render(<Pagination pages={5} currentPage={1} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('navigation', { name: 'Pagination' })
    ).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    render(
      <Pagination
        className="pagination-extra"
        pages={3}
        currentPage={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass(
      'pagination-extra'
    );
  });

  it('disables previous on first page and next on last page', () => {
    const { rerender } = render(
      <Pagination pages={4} currentPage={1} onPageChange={vi.fn()} />
    );

    expect(
      screen.getByRole('button', { name: 'Previous page' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Next page' })
    ).not.toBeDisabled();

    rerender(<Pagination pages={4} currentPage={4} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Previous page' })
    ).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange with page number when a page button is clicked', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination pages={6} currentPage={1} onPageChange={onPageChange} />
    );

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when first and last page buttons are clicked', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination pages={5} currentPage={3} onPageChange={onPageChange} />
    );

    await user.click(screen.getByRole('button', { name: '1' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    await user.click(screen.getByRole('button', { name: '5' }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);
  });

  it('calls onPageChange from chevron buttons', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination pages={4} currentPage={2} onPageChange={onPageChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('shows ellipsis when current page is far from start or end on long lists', () => {
    const { rerender } = render(
      <Pagination pages={20} currentPage={1} onPageChange={vi.fn()} />
    );

    expect(screen.getAllByText('...')).toHaveLength(1);

    rerender(<Pagination pages={20} currentPage={10} onPageChange={vi.fn()} />);

    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('renders first and last page alongside middle range for two pages only', () => {
    render(<Pagination pages={2} currentPage={1} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument();
  });
});
