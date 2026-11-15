import { configureStore } from "@reduxjs/toolkit";
import { dashboardApi } from "@/store/api/dashboardApi";
import uiReducer from "@/store/slices/uiSlice";
import authReducer from "@/store/slices/authSlice";
import billingReducer from "@/store/slices/billingSlice";
import accountsReducer from "@/store/slices/accountsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      billing: billingReducer,
      accounts: accountsReducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dashboardApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
