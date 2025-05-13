import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
};

const savingSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      });
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const { addTransaction, clearTransactions } = savingSlice.actions;
export default savingSlice.reducer;