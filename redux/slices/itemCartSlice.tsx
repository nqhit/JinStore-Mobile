import { CartItemType } from '@/interfaces/cart.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  itemCart: CartItemType[];
  add: {
    isFetching: boolean;
    error: string | null;
    success: boolean;
  };
  remove: {
    isFetching: boolean;
    error: string | null;
    success: boolean;
  };
  update: {
    isFetching: boolean;
    error: string | null;
    success: boolean;
  };
}

const initialState: CartState = {
  itemCart: [],
  add: {
    isFetching: false,
    error: null,
    success: false,
  },
  remove: {
    isFetching: false,
    error: null,
    success: false,
  },
  update: {
    isFetching: false,
    error: null,
    success: false,
  },
};

const itemSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addStart: (state) => {
      state.add.isFetching = true;
      state.add.error = null;
      state.add.success = false;
    },
    addSuccess: (state, action: PayloadAction<CartItemType>) => {
      state.add.isFetching = false;
      state.add.success = true;
      state.add.error = null;

      const existingItemIndex = state.itemCart.findIndex((item) => item._id === action.payload._id);

      if (existingItemIndex >= 0) {
        state.itemCart[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.itemCart.push(action.payload);
      }
    },
    addFailed: (state, action: PayloadAction<string>) => {
      state.add.isFetching = false;
      state.add.error = action.payload;
      state.add.success = false;
    },

    removeStart: (state) => {
      state.remove.isFetching = true;
      state.remove.error = null;
      state.remove.success = false;
    },
    removeSuccess: (state, action: PayloadAction<string>) => {
      state.remove.isFetching = false;
      state.remove.success = true;
      state.remove.error = null;
      state.itemCart = state.itemCart.filter((item) => item._id !== action.payload);
    },
    removeFailed: (state, action: PayloadAction<string>) => {
      state.remove.isFetching = false;
      state.remove.error = action.payload;
      state.remove.success = false;
    },

    updateQuantityStart: (state) => {
      state.update.isFetching = true;
      state.update.error = null;
      state.update.success = false;
    },
    updateQuantitySuccess: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      state.update.isFetching = false;
      state.update.success = true;
      state.update.error = null;

      const itemIndex = state.itemCart.findIndex((item) => item._id === action.payload.productId);

      if (itemIndex >= 0) {
        if (action.payload.quantity <= 0) {
          state.itemCart.splice(itemIndex, 1);
        } else {
          state.itemCart[itemIndex].quantity = action.payload.quantity;
        }
      }
    },
    updateQuantityFailed: (state, action: PayloadAction<string>) => {
      state.update.isFetching = false;
      state.update.error = action.payload;
      state.update.success = false;
    },

    clearCart: (state) => {
      state.itemCart = [];
    },

    resetAddState: (state) => {
      state.add = initialState.add;
    },
    resetRemoveState: (state) => {
      state.remove = initialState.remove;
    },
    resetUpdateState: (state) => {
      state.update = initialState.update;
    },
    resetAllCartStates: (state) => {
      state.add = initialState.add;
      state.remove = initialState.remove;
      state.update = initialState.update;
    },
  },
});

export const {
  addStart,
  addSuccess,
  addFailed,
  removeStart,
  removeSuccess,
  removeFailed,
  updateQuantityStart,
  updateQuantitySuccess,
  updateQuantityFailed,
  clearCart,
  resetAddState,
  resetRemoveState,
  resetUpdateState,
  resetAllCartStates,
} = itemSlice.actions;

export default itemSlice.reducer;
