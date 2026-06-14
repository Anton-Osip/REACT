'use client';

import { type FC, useCallback, useMemo } from 'react';

import clsx from 'clsx';

import { Button, CaretLeftIcon, CaretRightIcon, Typography } from '@components/common';

type Props = {
  className?: string;
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const pageButtonClassName =
  'size-6 min-w-6 p-0 flex items-center justify-center rounded text-sm font-bold leading-none';

const activePageClassName = 'bg-foreground text-background enabled:hover:opacity-100';

const chevronButtonClassName = 'size-4 min-w-4 p-0 flex items-center justify-center';

const FIRST_PAGE = 1;
const SECOND_PAGE = 2;
const LEFT_DOTS_THRESHOLD = 4;
const RIGHT_DOTS_OFFSET = 3;
const COMPACT_PAGINATION_MAX_PAGES = 5;
const FIXED_BOUNDARY_PAGES = 2;
// eslint-disable-next-line no-magic-numbers
const EARLY_CENTER_PAGES = [2, 3, 4, 5] as const;
// eslint-disable-next-line no-magic-numbers
const LATE_PAGE_OFFSETS = [4, 3, 2, 1] as const;
const NEIGHBOR_PAGE_OFFSET = 1;

export const Pagination: FC<Props> = ({ className, pages, currentPage, onPageChange }) => {
  const isFirstPage = currentPage === FIRST_PAGE;
  const isLastPage = currentPage === pages;
  const showLeftDots = currentPage > LEFT_DOTS_THRESHOLD;
  const showRightDots = currentPage < pages - RIGHT_DOTS_OFFSET;

  const centerPages = useMemo(() => {
    if (pages <= COMPACT_PAGINATION_MAX_PAGES) {
      return Array.from({ length: pages - FIXED_BOUNDARY_PAGES }, (_, i) => i + SECOND_PAGE);
    }

    if (currentPage <= LEFT_DOTS_THRESHOLD) return [...EARLY_CENTER_PAGES];
    if (currentPage >= pages - RIGHT_DOTS_OFFSET) {
      return LATE_PAGE_OFFSETS.map(offset => pages - offset);
    }

    return [currentPage - NEIGHBOR_PAGE_OFFSET, currentPage, currentPage + NEIGHBOR_PAGE_OFFSET];
  }, [currentPage, pages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= FIRST_PAGE && page <= pages) {
        onPageChange(page);
      }
    },
    [pages, onPageChange],
  );

  if (pages <= FIRST_PAGE) return null;

  return (
    <nav className={clsx('flex items-center gap-3', className)} aria-label="Pagination">
      <Button
        variant="ghost"
        disabled={isFirstPage}
        className={chevronButtonClassName}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
        icon={<CaretLeftIcon size={16} />}
      />

      <Button
        variant="ghost"
        className={clsx(pageButtonClassName, isFirstPage && activePageClassName)}
        onClick={() => handlePageChange(FIRST_PAGE)}
      >
        {FIRST_PAGE}
      </Button>

      {showLeftDots && (
        <Typography variant="p" aria-hidden="true" className="w-6 text-center text-foreground">
          ...
        </Typography>
      )}

      {centerPages.map(p => (
        <Button
          key={p}
          variant="ghost"
          className={clsx(pageButtonClassName, currentPage === p && activePageClassName)}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Button>
      ))}

      {showRightDots && (
        <Typography variant="p" aria-hidden="true" className="w-6 text-center text-foreground">
          ...
        </Typography>
      )}

      <Button
        variant="ghost"
        className={clsx(pageButtonClassName, isLastPage && activePageClassName)}
        onClick={() => handlePageChange(pages)}
      >
        {pages}
      </Button>

      <Button
        variant="ghost"
        disabled={isLastPage}
        className={chevronButtonClassName}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
        icon={<CaretRightIcon size={16} />}
      />
    </nav>
  );
};
