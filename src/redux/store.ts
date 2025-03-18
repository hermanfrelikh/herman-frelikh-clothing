import { configureStore } from '@reduxjs/toolkit';

import productsSlice from './slices/ProductsSlice';

export const store = configureStore({
  reducer: { productsSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
