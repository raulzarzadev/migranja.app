import { createSlice, Dispatch } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

export interface CouterState {
  value: number;
}

const initialState: CouterState = {
  value: 0,
};

export const incrementAsyncByAmount =
  (amount: number) => (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(incrementByAmount(amount));
    }, 1000);
  };

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Actions creators are generated for each case reducer funtion
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const selectCountState = (state: AppState) => state.counter.value;

export default counterSlice.reducer;
