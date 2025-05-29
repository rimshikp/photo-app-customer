import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../pages/actions/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
