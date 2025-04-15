import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { CartItem } from '../../@types/CartItem';

const API_BASE_URL = 'http://localhost:3001/api/cart';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as CartItem[];
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({
    product_id,
    size,
    quantity,
  }: {
    product_id: number;
    size: string;
    quantity: number;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.post(
      API_BASE_URL,
      { product_id, size, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data as CartItem;
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
