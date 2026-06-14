import { combineReducers, configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { charactersApi } from '@/services';

const rootReducer = combineReducers({
  [charactersApi.reducerPath]: charactersApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const createAppStore = (): EnhancedStore<RootState> =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(charactersApi.middleware),
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];

export const makeStore = (): AppStore => {
  const store = createAppStore();

  setupListeners(store.dispatch);

  return store;
};
