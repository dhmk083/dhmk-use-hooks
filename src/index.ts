import React from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

type Store<T> = {
  getState(): T;
  subscribe(fn: () => void): () => void;
};

const StoreContext = React.createContext<Store<any>>(undefined!);

export function Provider({ state, children }) {
  const ctx = React.useRef<any>({
    _state: state,

    getState() {
      return ctx.current._state;
    },

    _listeners: new Set<Function>(),

    subscribe(fn: Function) {
      ctx.current._listeners.add(fn);
      return () => ctx.current._listeners.delete(fn);
    },
  });

  React.useEffect(() => {
    ctx.current._state = state;
    ctx.current._listeners.forEach((x) => x());
  });

  const [PureChildren] = React.useState(() => React.memo(() => children));

  return React.createElement(
    StoreContext.Provider,
    { value: ctx.current },
    React.createElement(PureChildren)
  );
}

export const useSelector = <T, S = any>(
  fn: (state: S) => T,
  eq: (a: T, b: T) => boolean = Object.is
) => {
  const { getState, subscribe } = React.useContext(StoreContext);

  return useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getState,
    fn,
    eq
  );
};

export const createSelectorHook = <S>() =>
  useSelector as <T>(fn: (state: S) => T, eq?: (a: T, b: T) => boolean) => T;
