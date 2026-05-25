import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from '@/features/character/model/constants.ts';
import { renderWithRouter, useGetCharactersMock } from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

vi.mock('@/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utils')>();
  return {
    ...actual,
    loadFromStorage: vi.fn(),
  };
});

const mockedLoadFromStorage = vi.mocked(loadFromStorage);

describe('/character route validateSearch', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
    useGetCharactersMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('normalizes invalid page to 1', async () => {
    const { router } = await renderWithRouter('/character?page=abc');

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ page: 1 });
    });
  });

  it('normalizes zero or negative page to 1', async () => {
    const { router } = await renderWithRouter('/character?page=0');

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ page: 1 });
    });
  });

  it('uses search from storage when URL has no search param', async () => {
    mockedLoadFromStorage.mockReturnValue('pickle rick');

    const { router } = await renderWithRouter('/character');

    await waitFor(() => {
      expect(mockedLoadFromStorage).toHaveBeenCalledWith(STORAGE_KEY, '');
      expect(router.state.location.search).toMatchObject({
        search: 'pickle rick',
        page: 1,
      });
    });
  });

  it('prefers URL search over storage value', async () => {
    mockedLoadFromStorage.mockReturnValue('storage term');

    const { router } = await renderWithRouter('/character?search=url-term');

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({
        search: 'url-term',
        page: 1,
      });
    });
  });
});
