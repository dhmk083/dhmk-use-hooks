# useHooks

`npm install @dhmk/use-hooks`

This package optimizes usage of a _global_ state in a React app.

It lets you use any hooks at the top level of your app without refreshing all children components on state changes.

Normally, if you have a code like this:

```tsx
function App() {
  return <AppState.Provider value={appState}>...</AppState.Provider>;
}
```

any changes in state will cause unnecessary re-renders in descendant components.

This package allows you to tune which components should re-render in a similar way that `react-redux` does, but without actually using `redux`.

For more info see examples folder.

## API

### `<Provider state={}>...</Provider>`

Provides a state to children components via context. Whenever the state changes it will **NOT** update children. Instead, any children descendants, that called `useSelector` will be updated if selector produces a different value.

### `useSelector<S, T>(fn: (state: S) => T, eq?: (a: T, b: T) => boolean)`

Same as Redux `useSelector`. It will trigger an update only if newly selected value differs from previous one.

### `createSelectorHook<S>()`

Helper for typescript

```ts
function useApp() {
  return {
    counter: useCounter(),
    todos: useTodos(),
  };
}

const useSelector = createSelectorHook<ReturnType<typeof useApp>>();

// now `s` will have correct type instead of `any`
useSelector(s => ...)
```
