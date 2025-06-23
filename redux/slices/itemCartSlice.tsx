import { CartItem } from '@/interfaces/cart.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const itemSlice = createSlice({
  name: 'cart',
  initialState: {
    itemCart: [] as CartItem[],
    add: {
      isFetching: false,
      error: null as string | null,
      success: false,
    },
  },
  reducers: {
    addStart: (state) => {
      state.add.isFetching = true;
      state.add.error = null;
      state.add.success = false;
    },
    addSuccess: (state, action: PayloadAction<CartItem>) => {
      state.add.isFetching = false;
      state.add.success = true;
      state.add.error = null;
      state.itemCart.push(action.payload);
    },
    addFailed: (state, action: PayloadAction<string>) => {
      state.add.isFetching = false;
      state.add.error = action.payload;
      state.add.success = false;
    },

    //NOTE: Reset trạng thái (tùy chọn)
    resetAddState(state) {
      state.add = { isFetching: false, error: null, success: false };
    },
  },
});

export const { addStart, addSuccess, addFailed, resetAddState } = itemSlice.actions;
export default itemSlice.reducer;
