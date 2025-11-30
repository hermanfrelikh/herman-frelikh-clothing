// favoritesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { Product } from '../../@types/Product';

// === API URL ===
const FAVORITES_API = 'http://localhost:3003/api/favorites';
const PRODUCTS_API = 'http://localhost:3002/api/products';

interface FavoritesState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

// === Загрузка избранного с бэка + обогащение данными ===
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    // 1. Получаем ID товаров из избранного
    const favRes = await axios.get(FAVORITES_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favoriteItems = favRes.data as Array<{ product_id: number }>;

    // 2. Получаем все товары
    const productsRes = await axios.get(PRODUCTS_API);
    const products = productsRes.data as Product[];

    // 3. Фильтруем товары, которые в избранном
    return products.filter(p =>
      favoriteItems.some(fav => fav.product_id === p.id),
    );
  },
);

// === Добавление в избранное ===
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (product: Product, { dispatch }) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await axios.post(
      FAVORITES_API,
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    // Перезагружаем избранное с сервера
    dispatch(fetchFavorites());
    return product; // для совместимости (не используется напрямую)
  },
);

// === Удаление из избранного ===
export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (id: number, { dispatch }) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await axios.delete(`${FAVORITES_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(fetchFavorites());
    return id;
  },
);

// === Слайс ===
export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      });
    // addToFavorites и removeFromFavorites не изменяют state напрямую — они вызывают fetchFavorites
  },
});

export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items;

export default favoritesSlice.reducer;
