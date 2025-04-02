import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { Product } from '../../@types/Product';

const initialState: Product[] = JSON.parse(
  localStorage.getItem('favorites') || '[]',
);

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Product>) => {
      if (!state.some(product => product.id === action.payload.id)) {
        state.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    removeFavorites: (state, action: PayloadAction<Product>) => {
      const updatedState = state.filter(
        product => product.id !== action.payload.id,
      );
      localStorage.setItem('favorites', JSON.stringify(state));
      return updatedState;
    },
  },
});

export const { setFavorites, removeFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: Product[] }) =>
  state.favorites;

export default favoritesSlice.reducer;
