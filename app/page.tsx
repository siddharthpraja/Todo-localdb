"use client";
import { useEffect, useRef, useState } from "react";

interface Todo {
  id: number;
  text: string;
  isComplete: boolean;
}

export default function Home(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load todos from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTodos = localStorage.getItem("dataTodos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    }
  }, []);

  // Save todos to localStorage on todos change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dataTodos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (): void => {
    if (!inputRef.current) return;

    const inputText: string = inputRef.current.value.trim();

    if (inputText === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };

  const deleteTodo = (id: number): void => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id);
    });
  };

  const toggle = (id: number): void => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };

  return (
    <div className="flex justify-center h-screen items-center text-center font-mono">
      <div className="h-2/4">
        <div>
          <h1 className="text-xl font-bold p-10">📆 Todo List</h1>
        </div>
        <input
          ref={inputRef}
          placeholder="Type your task"
          className="w-max p-2 m-1 border border-yellow-600"
        />
        <button
          className="bg-yellow-300 text-sm p-2 border border-black"
          onClick={addTodo}
        >
          Add Todo
        </button>
        <ul>
          {todos.map((data, index) => (
            <li
              className={`text-lg p-2 w-full flex justify-between  ${
                data.isComplete ? "line-through" : ""
              } `}
              key={index}
              id={data.id.toString()}
            >
              {data.text}
              <span>
                <button
                  className={`text-xl `}
                  onClick={() => {
                    toggle(data.id);
                  }}
                >
                  {"  "} {data.isComplete ? "✅" : "✔️"}
                </button>
                <button
                  className="text-xl"
                  onClick={() => {
                    deleteTodo(data.id);
                  }}
                >
                  ❌
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
