import { configureStore } from '@reduxjs/toolkit';

// Импортируем редьюсеры из слайсов
import cartReducer from './slices/cartSlice';
import categoriesReducer from './slices/categoriesSlice';
import favoritesReducer from './slices/favoritesSlice';
import productsReducer from './slices/productsSlice';

// Настройка хранилища Redux
export const store = configureStore({
  reducer: {
    productsSlice: productsReducer, // Слайс продуктов
    favoritesSlice: favoritesReducer, // Слайс избранных товаров
    cartSlice: cartReducer, // Слайс корзины
    categoriesSlice: categoriesReducer, // Слайс категорий
  },
});

// Типизация состояния Redux
export type RootState = ReturnType<typeof store.getState>;

// Типизация dispatch для поддержки асинхронных экшенов
export type AppDispatch = typeof store.dispatch;
