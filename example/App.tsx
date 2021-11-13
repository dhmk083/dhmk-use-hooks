import React from "react";
import { useStateMerge } from "@dhmk/react";
import { createSelectorHook, Provider } from "../src";

const useSelector = createSelectorHook<ReturnType<typeof useApp>>();

function RendersCounter() {
  const count = React.useRef(1);
  React.useEffect(() => {
    count.current = count.current + 1;
  });

  return <p>Re-renders: {count.current}</p>;
}

function Counter() {
  const value = useSelector((s) => s.counter.value);
  const increment = useSelector((s) => s.counter.increment);
  const decrement = useSelector((s) => s.counter.decrement);

  return (
    <div>
      <RendersCounter />
      <h1>{value}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const Todo = ({ todo }) => {
  const toggleTodo = useSelector((s) => s.todos.toggleTodo);
  const deleteTodo = useSelector((s) => s.todos.deleteTodo);

  return (
    <li
      onClick={() => {
        toggleTodo(todo.id);
      }}
      style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}
    >
      {todo.text}
      <button onClick={() => deleteTodo(todo.id)}>x</button>
    </li>
  );
};

const NewTodo = () => {
  const addTodo = useSelector((s) => s.todos.addTodo);
  const [text, setText] = React.useState("");

  return (
    <input
      value={text}
      onChange={(ev) => {
        setText(ev.target.value);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") addTodo(text);
      }}
    />
  );
};

const TodoList = () => {
  const todos = useSelector((state) => state.todos.todos);

  return (
    <div>
      <RendersCounter />
      <NewTodo />
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "auto",
        width: "50vw",
      }}
    >
      <Counter />
      <TodoList />
    </div>
  );
}

function useCounter() {
  const [state, set] = useStateMerge(() => ({
    value: 0,
    increment: () => set((s) => ({ value: s.value + 1 })),
    decrement: () => set((s) => ({ value: s.value - 1 })),
  }));

  return state;
}

const createTodo = (text) => ({
  id: Date.now(),
  text,
  isCompleted: false,
});

function useTodos() {
  const [state, set] = useStateMerge(() => ({
    todos: [createTodo("Make a sandwich")],

    addTodo: (text) =>
      set((old) => ({ todos: old.todos.concat(createTodo(text)) })),

    toggleTodo: (id) =>
      set((old) => ({
        todos: old.todos.map((t) =>
          t.id !== id ? t : { ...t, isCompleted: !t.isCompleted }
        ),
      })),

    deleteTodo: (id) =>
      set((old) => ({ todos: old.todos.filter((x) => x.id !== id) })),
  }));

  return state;
}

function useApp() {
  return {
    counter: useCounter(),
    todos: useTodos(),
  };
}

export default function AppWrapper() {
  const state = useApp();

  return (
    <Provider state={state}>
      <App />
    </Provider>
  );
}
