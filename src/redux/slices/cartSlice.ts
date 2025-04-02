import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  images: string[];
  size: string;
  rating: number;
  gender: string;
  category: string;
}

const initialState: CartItem[] = JSON.parse(
  localStorage.getItem('cart') || '[]',
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItem: (state, action: PayloadAction<CartItem>) => {
      if (!state.some(product => product.id === action.payload.id)) {
        state.push(action.payload);
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    removeCartItem: (state, action: PayloadAction<CartItem>) => {
      const updatedState = state.filter(
        product => product.id !== action.payload.id,
      );
      localStorage.setItem('cart', JSON.stringify(state));
      return updatedState;
    },
  },
});

export const { setCartItem, removeCartItem } = cartSlice.actions;

export const selectCart = (state: { cart: CartItem[] }) => state.cart;

export default cartSlice.reducer;
