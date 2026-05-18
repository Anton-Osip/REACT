import { type FC, useCallback, useMemo } from 'react';
import styles from './pagination.module.css';
import clsx from 'clsx';
import { Button } from '../button';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Typography } from '../typography';

interface PaginationProps {
  className?: string;
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  className,
  pages,
  currentPage,
  onPageChange,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pages;
  const showLeftDots = currentPage > 4;
  const showRightDots = currentPage < pages - 3;

  const centerPages = useMemo(() => {
    if (pages <= 5) {
      return Array.from({ length: pages - 2 }, (_, i) => i + 2);
    }

    if (currentPage <= 4) return [2, 3, 4, 5];
    if (currentPage >= pages - 3)
      return [pages - 4, pages - 3, pages - 2, pages - 1];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pages) {
        onPageChange(page);
      }
    },
    [pages, onPageChange]
  );

  if (pages <= 1) return null;

  return (
    <div
      className={clsx(styles.pagination, className)}
      role="navigation"
      aria-label="Pagination"
    >
      <Button
        variant={'ghost'}
        disabled={isFirstPage}
        className={styles.chevronBtn}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        className={clsx(styles.btn, isFirstPage && styles.active)}
        variant={'ghost'}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>

      {showLeftDots && (
        <Typography
          variant={'body2'}
          aria-hidden="true"
          className={styles.dots}
        >
          ...
        </Typography>
      )}

      {centerPages.map((p) => (
        <Button
          key={p}
          variant={'ghost'}
          className={clsx(styles.btn, currentPage === p && styles.active)}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Button>
      ))}

      {showRightDots && (
        <Typography
          variant={'body2'}
          aria-hidden="true"
          className={styles.dots}
        >
          ...
        </Typography>
      )}

      <Button
        variant={'ghost'}
        className={clsx(styles.btn, isLastPage && styles.active)}
        onClick={() => handlePageChange(pages)}
      >
        {pages}
      </Button>

      <Button
        variant={'ghost'}
        disabled={isLastPage}
        className={styles.chevronBtn}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
