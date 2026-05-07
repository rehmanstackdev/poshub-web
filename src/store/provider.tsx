"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { hydrateFromStorage } from "./auth-slice";

function Hydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());
  }, []);
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Hydrator>{children}</Hydrator>
    </Provider>
  );
}
