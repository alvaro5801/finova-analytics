"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, type AppStore } from "@/store/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => {
    const newStore = makeStore();
    setupListeners(newStore.dispatch);
    return newStore;
  });

  return <Provider store={store}>{children}</Provider>;
}
