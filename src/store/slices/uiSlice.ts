import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  direction: "ltr" | "rtl";
}

const initialState: UiState = {
  sidebarOpen: false,
  sidebarCollapsed: false,
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
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setDirection(state, action: PayloadAction<"ltr" | "rtl">) {
      state.direction = action.payload;
    },
  },
});

export const { openSidebar, closeSidebar, toggleSidebar, toggleSidebarCollapsed, setDirection } =
  uiSlice.actions;
export default uiSlice.reducer;
