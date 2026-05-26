import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/shared/api';
import { createCharactersResponse } from '@/shared/test-utils';

import {
  characterQueryKeys,
  useGetCharacters,
  useGetCharactersDetails,
} from './queries.ts';

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

  it('fetches each page once when navigating between pages', async () => {
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

  it('reuses cached data when returning to a previously visited page', async () => {
    const pageOne = createCharactersResponse();
    const pageTwo = createCharactersResponse({
      results: [
        {
          ...pageOne.results[0],
          id: 9,
          name: 'Summer Smith',
        },
      ],
    });

    mockedGet.mockResolvedValueOnce(pageOne).mockResolvedValueOnce(pageTwo);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          gcTime: Infinity,
        },
      },
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

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledTimes(1);

    rerender({ page: 2 });
    await waitFor(() => expect(result.current.data).toEqual(pageTwo));
    expect(mockedGet).toHaveBeenCalledTimes(2);

    rerender({ page: 1 });
    await waitFor(() => expect(result.current.data).toEqual(pageOne));
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('refetches list data when the query cache is invalidated', async () => {
    const response = createCharactersResponse();
    mockedGet.mockResolvedValue(response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetCharacters({ page: 1 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledTimes(1);

    await queryClient.invalidateQueries({
      queryKey: characterQueryKeys.list({ page: 1 }),
    });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2));
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

  it('reuses cached details when reopening the same character', async () => {
    const character = createCharactersResponse().results[0];
    mockedGet.mockResolvedValue(character);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          gcTime: Infinity,
        },
      },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, rerender } = renderHook(
      ({ characterId }: { characterId: number }) =>
        useGetCharactersDetails({ characterId }),
      {
        wrapper,
        initialProps: { characterId: 7 },
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledTimes(1);

    rerender({ characterId: 8 });
    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2));

    rerender({ characterId: 7 });
    await waitFor(() => expect(result.current.data).toEqual(character));
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('refetches details when the query cache is invalidated', async () => {
    const character = createCharactersResponse().results[0];
    mockedGet.mockResolvedValue(character);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useGetCharactersDetails({ characterId: 7 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledTimes(1);

    await queryClient.invalidateQueries({
      queryKey: characterQueryKeys.details({ characterId: 7 }),
    });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2));
  });
});
