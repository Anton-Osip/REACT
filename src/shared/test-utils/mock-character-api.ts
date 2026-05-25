import type { UseQueryResult } from '@tanstack/react-query';
import { vi } from 'vitest';

import type {
  CharacterResponse,
  CharactersResponse,
} from '@/features/character/api';

import { createCharactersResponse } from './mock-characters.ts';

export const useGetCharactersMock = vi.fn();
export const useGetCharactersDetailsMock = vi.fn();

vi.mock('@/features/character/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/character/api')>();

  return {
    ...actual,
    useGetCharacters: (...args: unknown[]) => useGetCharactersMock(...args),
    useGetCharactersDetails: (...args: unknown[]) =>
      useGetCharactersDetailsMock(...args),
  };
});

const noopRefetch = vi.fn(() =>
  Promise.resolve({} as UseQueryResult<CharactersResponse, Error>)
);

type CharactersQueryRefetch = UseQueryResult<
  CharactersResponse,
  Error
>['refetch'];
type DetailsQueryRefetch = UseQueryResult<CharacterResponse, Error>['refetch'];

function createBaseQueryResult<T>(): Omit<
  UseQueryResult<T, Error>,
  | 'data'
  | 'error'
  | 'status'
  | 'isError'
  | 'isLoading'
  | 'isFetching'
  | 'isSuccess'
  | 'isPending'
> {
  return {
    isLoadingError: false as const,
    isRefetchError: false as const,
    isPlaceholderData: false,
    isStale: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isRefetching: false,
    isLoading: false,
    isPending: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isInitialLoading: false,
    isPaused: false,
    status: 'pending',
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isEnabled: true,
    fetchStatus: 'idle',
    promise: Promise.resolve({} as T),
    refetch: noopRefetch,
  } as unknown as Omit<
    UseQueryResult<T, Error>,
    | 'data'
    | 'error'
    | 'status'
    | 'isError'
    | 'isLoading'
    | 'isFetching'
    | 'isSuccess'
    | 'isPending'
  >;
}

export function createSuccessCharactersQuery(
  data: CharactersResponse = createCharactersResponse(),
  refetch: CharactersQueryRefetch = noopRefetch as unknown as CharactersQueryRefetch
): UseQueryResult<CharactersResponse, Error> {
  return {
    ...createBaseQueryResult<CharactersResponse>(),
    data,
    error: null,
    isError: false,
    isLoading: false,
    isFetching: false,
    isPending: false,
    isSuccess: true,
    status: 'success',
    refetch,
  } as UseQueryResult<CharactersResponse, Error>;
}

export function createLoadingCharactersQuery(
  refetch: CharactersQueryRefetch = noopRefetch as unknown as CharactersQueryRefetch
): UseQueryResult<CharactersResponse, Error> {
  return {
    ...createBaseQueryResult<CharactersResponse>(),
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
    isFetching: true,
    isPending: true,
    isSuccess: false,
    status: 'pending',
    refetch,
  } as UseQueryResult<CharactersResponse, Error>;
}

export function createErrorCharactersQuery(
  error: unknown,
  refetch: CharactersQueryRefetch = noopRefetch as unknown as CharactersQueryRefetch
): UseQueryResult<CharactersResponse, Error> {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error));

  return {
    ...createBaseQueryResult<CharactersResponse>(),
    data: undefined,
    error: normalizedError,
    isError: true,
    isLoading: false,
    isFetching: false,
    isPending: false,
    isSuccess: false,
    status: 'error',
    refetch,
  } as UseQueryResult<CharactersResponse, Error>;
}

export function createSuccessDetailsQuery(
  data: CharacterResponse,
  refetch: DetailsQueryRefetch = noopRefetch as unknown as DetailsQueryRefetch
): UseQueryResult<CharacterResponse, Error> {
  return {
    ...createBaseQueryResult<CharacterResponse>(),
    data,
    error: null,
    isError: false,
    isLoading: false,
    isFetching: false,
    isPending: false,
    isSuccess: true,
    status: 'success',
    refetch,
  } as UseQueryResult<CharacterResponse, Error>;
}

export function createLoadingDetailsQuery(
  refetch: DetailsQueryRefetch = noopRefetch as unknown as DetailsQueryRefetch
): UseQueryResult<CharacterResponse, Error> {
  return {
    ...createBaseQueryResult<CharacterResponse>(),
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
    isFetching: true,
    isPending: true,
    isSuccess: false,
    status: 'pending',
    refetch,
  } as UseQueryResult<CharacterResponse, Error>;
}

export function createErrorDetailsQuery(
  error: unknown,
  refetch: DetailsQueryRefetch = noopRefetch as unknown as DetailsQueryRefetch
): UseQueryResult<CharacterResponse, Error> {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error));

  return {
    ...createBaseQueryResult<CharacterResponse>(),
    data: undefined,
    error: normalizedError,
    isError: true,
    isLoading: false,
    isFetching: false,
    isPending: false,
    isSuccess: false,
    status: 'error',
    refetch,
  } as UseQueryResult<CharacterResponse, Error>;
}

export function setupDefaultCharacterApiMocks() {
  useGetCharactersMock.mockReset();
  useGetCharactersDetailsMock.mockReset();
  useGetCharactersMock.mockReturnValue(createSuccessCharactersQuery());
  useGetCharactersDetailsMock.mockReturnValue(createLoadingDetailsQuery());
}
