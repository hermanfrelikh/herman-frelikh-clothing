import { configureStore } from '@reduxjs/toolkit';

import cartSlice from './slices/cartSlice';
import categoriesSlice from './slices/categoriesSlice';
import favoritesSlice from './slices/favoritesSlice';
import productsSlice from './slices/productsSlice';

export const store = configureStore({
  reducer: { productsSlice, favoritesSlice, cartSlice, categoriesSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
