'use client';

import { type FC, type ReactNode, useMemo } from 'react';

import clsx from 'clsx';

import { Button, CaretLeftIcon, CaretRightIcon, Typography } from '@components/common';

type PageFormProps = {
  page: number;
  search?: string;
  characterId?: string | null;
  formAction: (payload: FormData) => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
};

const PageForm: FC<PageFormProps> = ({
  page,
  search,
  characterId,
  formAction,
  isPending = false,
  disabled = false,
  className,
  children,
  'aria-label': ariaLabel,
}) => (
  <form action={formAction}>
    <input type="hidden" name="page" value={page} />
    {search ? <input type="hidden" name="search" value={search} /> : null}
    {characterId ? <input type="hidden" name="characterId" value={characterId} /> : null}
    <Button type="submit" variant="ghost" className={className} disabled={disabled || isPending} aria-label={ariaLabel}>
      {children}
    </Button>
  </form>
);

type Props = {
  className?: string;
  pages: number;
  currentPage: number;
  formAction: (payload: FormData) => void;
  search?: string;
  characterId?: string | null;
  isPending?: boolean;
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

export const Pagination: FC<Props> = ({
  className,
  pages,
  currentPage,
  formAction,
  search,
  characterId,
  isPending = false,
}) => {
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

  if (pages <= FIRST_PAGE) return null;

  return (
    <nav className={clsx('flex items-center gap-3', className)} aria-label="Pagination">
      <PageForm
        page={currentPage - 1}
        search={search}
        characterId={characterId}
        formAction={formAction}
        isPending={isPending}
        disabled={isFirstPage}
        className={chevronButtonClassName}
        aria-label="Previous page"
      >
        <CaretLeftIcon size={16} />
      </PageForm>

      <PageForm
        page={FIRST_PAGE}
        search={search}
        characterId={characterId}
        formAction={formAction}
        isPending={isPending}
        className={clsx(pageButtonClassName, isFirstPage && activePageClassName)}
      >
        {FIRST_PAGE}
      </PageForm>

      {showLeftDots && (
        <Typography variant="p" aria-hidden="true" className="w-6 text-center text-foreground">
          ...
        </Typography>
      )}

      {centerPages.map(page => (
        <PageForm
          key={page}
          page={page}
          search={search}
          characterId={characterId}
          formAction={formAction}
          isPending={isPending}
          className={clsx(pageButtonClassName, currentPage === page && activePageClassName)}
        >
          {page}
        </PageForm>
      ))}

      {showRightDots && (
        <Typography variant="p" aria-hidden="true" className="w-6 text-center text-foreground">
          ...
        </Typography>
      )}

      <PageForm
        page={pages}
        search={search}
        characterId={characterId}
        formAction={formAction}
        isPending={isPending}
        className={clsx(pageButtonClassName, isLastPage && activePageClassName)}
      >
        {pages}
      </PageForm>

      <PageForm
        page={currentPage + 1}
        search={search}
        characterId={characterId}
        formAction={formAction}
        isPending={isPending}
        disabled={isLastPage}
        className={chevronButtonClassName}
        aria-label="Next page"
      >
        <CaretRightIcon size={16} />
      </PageForm>
    </nav>
  );
};
