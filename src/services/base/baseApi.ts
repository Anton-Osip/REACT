import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@services/base/baseQuery';

export const baseApi = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
  reducerPath: 'rickandmortyapi',
  tagTypes: ['characters'],
});
