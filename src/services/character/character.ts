import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { baseApi } from '@services/base';
import type { CharactersArgs, CharactersResponse } from '@services/character';

const EMPTY_CHARACTERS_RESPONSE: CharactersResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

const isNothingHereError = (error: FetchBaseQueryError): boolean => {
  if (error.status !== 404) return false;

  const { data } = error;

  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    (data as { error: string }).error === 'There is nothing here'
  );
};

export const charactersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCharacters: builder.query<CharactersResponse, CharactersArgs>({
      async queryFn({ page = 1, name = '' }, _queryApi, _extraOptions, fetchWithBQ) {
        const searchParams = new URLSearchParams();

        if (name) searchParams.set('name', name);
        if (page != null) searchParams.set('page', String(page));

        const url = `/character${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        const result = await fetchWithBQ(url);

        if (result.error) {
          if (isNothingHereError(result.error)) {
            return { data: EMPTY_CHARACTERS_RESPONSE };
          }

          return { error: result.error };
        }

        return { data: result.data as CharactersResponse };
      },
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'characters' as const, id })),
              { type: 'characters', id: 'LIST' },
            ]
          : [{ type: 'characters', id: 'LIST' }],
    }),
  }),
});

export const { useGetCharactersQuery } = charactersApi;
