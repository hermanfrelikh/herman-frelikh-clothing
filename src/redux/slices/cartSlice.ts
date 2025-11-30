import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { CartItem } from '../../@types/CartItem';

const CART_API = 'http://localhost:3003/api/cart';
const PRODUCTS_API = 'http://localhost:3002/api/products';

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

  const cartRes = await axios.get(CART_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const productsRes = await axios.get(PRODUCTS_API);

  const cartItems = cartRes.data as Array<{
    id: number;
    product_id: number;
    size: string;
    quantity: number;
  }>;
  const products = productsRes.data as Array<
    Omit<CartItem, 'id' | 'size' | 'quantity'>
  >;

  return cartItems
    .map(item => {
      const prod = products.find(p => p.id === item.product_id);
      return prod ? { ...item, ...prod } : null;
    })
    .filter(Boolean) as CartItem[];
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    {
      product_id,
      size,
      quantity,
    }: { product_id: number; size: string; quantity: number },
    { dispatch },
  ) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await axios.post(
      CART_API,
      { product_id, size, quantity },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch(fetchCart());
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await axios.delete(`${CART_API}/${id}`, {
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
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
