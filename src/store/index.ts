import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import typeringReducer from "./slices/typering";

export const store = configureStore({
  reducer: {
    typering: typeringReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
