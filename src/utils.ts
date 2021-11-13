import React from "react";

export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export const useUpdate = () => {
  const [, update] = React.useReducer((x) => (x + 1) & 0xffffffff, 0); // Prevents reaching MAX_SAFE_INTEGER (can this ever be possible?)
  return update;
};
