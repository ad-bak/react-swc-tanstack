import { useMutation } from "@tanstack/react-query";
import type { Todo } from "../types/todo";
import { createTodo } from "./api";

export function useCrateTodo() {
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("Creating todo...");
    },
    onError: () => {
      console.log("Error creating todo");
    },
    onSuccess: () => {
      console.log("Todo created successfully");
    },
  });
}
