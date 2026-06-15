import {
  combineReducers,
  configureStore,
  type EnhancedStore,
  type ThunkDispatch,
  type UnknownAction,
} from '@reduxjs/toolkit';

import { charactersApi } from '@/services';

const rootReducer = combineReducers({
  [charactersApi.reducerPath]: charactersApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const createAppStore = (preloadedState?: Partial<RootState>): EnhancedStore<RootState> =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(charactersApi.middleware),
    preloadedState,
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export const makeStore = createAppStore;
