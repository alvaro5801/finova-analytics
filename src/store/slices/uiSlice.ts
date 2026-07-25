import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  direction: "ltr" | "rtl";
}

const initialState: UiState = {
  sidebarOpen: false,
  direction: "ltr",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setDirection(state, action: PayloadAction<"ltr" | "rtl">) {
      state.direction = action.payload;
    },
  },
});

export const { openSidebar, closeSidebar, toggleSidebar, setDirection } = uiSlice.actions;
export default uiSlice.reducer;
