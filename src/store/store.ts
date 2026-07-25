import { configureStore } from "@reduxjs/toolkit";
import { dashboardApi } from "@/store/api/dashboardApi";
import uiReducer from "@/store/slices/uiSlice";
import authReducer from "@/store/slices/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dashboardApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
