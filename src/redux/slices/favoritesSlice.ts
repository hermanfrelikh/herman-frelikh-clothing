import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Тип Product (должен соответствовать структуре данных)
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string | null;
  category: string;
  image: string | null;
  images: string[];
  gender: string;
  sizes: string[];
  rating: number;
}

// Интерфейс состояния
interface FavoritesState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: FavoritesState = {
  items: JSON.parse(localStorage.getItem('favorites') || '[]'), // Загружаем данные из localStorage
  loading: false,
  error: null,
};

// Добавление товара в избранное
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (product: Product, { rejectWithValue }) => {
    try {
      return product; // Возвращаем товар для добавления
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to favorites');
    }
  },
);

// Удаление товара из избранного
export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (id: number, { rejectWithValue }) => {
    try {
      return id; // Возвращаем ID товара для удаления
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to remove from favorites',
      );
    }
  },
);

// Создаем слайс
export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Добавление товара в избранное
      .addCase(addToFavorites.fulfilled, (state, action) => {
        if (!state.items.some(item => item.id === action.payload.id)) {
          state.items.push(action.payload); // Добавляем новый товар в массив
          localStorage.setItem('favorites', JSON.stringify(state.items)); // Сохраняем в localStorage
        }
      })
      // Удаление товара из избранного
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload); // Удаляем товар по ID
        localStorage.setItem('favorites', JSON.stringify(state.items)); // Обновляем localStorage
      });
  },
});

// Селектор для получения избранных товаров
export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items;

export default favoritesSlice.reducer;
