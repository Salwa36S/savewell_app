import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Features/UserSlice'; // ✅ Adjust path as needed

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
