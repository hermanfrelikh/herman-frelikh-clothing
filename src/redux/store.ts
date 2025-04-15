import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';
import categoriesReducer from './slices/categoriesSlice';
import favoritesReducer from './slices/favoritesSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    productsSlice: productsReducer,
    favoritesSlice: favoritesReducer,
    cartSlice: cartReducer,
    categoriesSlice: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
