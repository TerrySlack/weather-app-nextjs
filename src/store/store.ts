import { configureStore } from "@reduxjs/toolkit";
import { cityWeatherReducer } from "./slices/cityWeatherSlice";

export const store = configureStore({
  reducer: {
    cityState: cityWeatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
