// favoritesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { Product } from '../../@types/Product';

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

const getValidToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found — please log in again.');
  }
  return token;
};

export const fetchFavorites = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('favorites/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const token = getValidToken();

    const [favRes, productsRes] = await Promise.all([
      axios.get(FAVORITES_API, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(PRODUCTS_API),
    ]);

    const favoriteItems = favRes.data as Array<{ product_id: number }>;
    const products = productsRes.data as Product[];

    return products.filter(p =>
      favoriteItems.some(fav => fav.product_id === p.id),
    );
  } catch (err: any) {
    console.error('Fetch favorites error:', err);
    return rejectWithValue(
      err.response?.data?.detail || 'Failed to load favorites',
    );
  }
});

export const addToFavorites = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>(
  'favorites/addToFavorites',
  async (product, { dispatch, rejectWithValue }) => {
    try {
      const token = getValidToken();
      const productId = Number(product.id);

      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      await axios.post(
        FAVORITES_API,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(fetchFavorites());
      return product;
    } catch (err: any) {
      console.error('Add to favorites error:', err);
      return rejectWithValue(
        err.response?.data?.detail || 'Could not add to favorites',
      );
    }
  },
);

export const removeFromFavorites = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'favorites/removeFromFavorites',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const token = getValidToken();
      const validId = Number(productId);
      if (isNaN(validId)) throw new Error('Invalid product ID');

      await axios.delete(`${FAVORITES_API}/${validId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchFavorites());
      return validId;
    } catch (err: any) {
      console.error('Remove from favorites error:', err);
      return rejectWithValue(
        err.response?.data?.detail || 'Could not remove from favorites',
      );
    }
  },
);

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError: state => {
      state.error = null;
    },
  },
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
        state.error = action.payload || 'Failed to load favorites';
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add to favorites';
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove from favorites';
      });
  },
});

export const { clearFavoritesError } = favoritesSlice.actions;
export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items;
export default favoritesSlice.reducer;
