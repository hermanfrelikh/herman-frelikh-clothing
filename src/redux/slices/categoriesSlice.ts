import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: string = 'All';

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;

export const selectFavorites = (state: { categories: string }) =>
  state.categories;

export default categoriesSlice.reducer;
