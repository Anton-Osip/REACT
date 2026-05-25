import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/shared/api';
import { createCharactersResponse } from '@/shared/test-utils';

import { useGetCharacters, useGetCharactersDetails } from './queries.ts';

vi.mock('@/shared/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(apiClient.get);

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useGetCharacters', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads characters via react-query', async () => {
    const response = createCharactersResponse();
    mockedGet.mockResolvedValue(response);

    const { result } = renderHook(
      () => useGetCharacters({ name: 'rick', page: 2 }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(response);
    expect(mockedGet).toHaveBeenCalledWith('/api/character?name=rick&page=2');
  });

  it('keeps previous data as placeholder while refetching', async () => {
    const first = createCharactersResponse();
    const second = createCharactersResponse({
      results: [
        {
          ...first.results[0],
          id: 9,
          name: 'Summer Smith',
        },
      ],
    });

    mockedGet.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useGetCharacters({ page }),
      {
        wrapper,
        initialProps: { page: 1 },
      }
    );

    await waitFor(() => expect(result.current.data).toEqual(first));

    rerender({ page: 2 });

    await waitFor(() => expect(result.current.data).toEqual(second));
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });
});

describe('useGetCharactersDetails', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('loads character details by id', async () => {
    const character = createCharactersResponse().results[0];
    mockedGet.mockResolvedValue(character);

    const { result } = renderHook(
      () => useGetCharactersDetails({ characterId: 7 }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(character);
    expect(mockedGet).toHaveBeenCalledWith('/api/character/7');
  });
});
