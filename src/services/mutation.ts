import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../types/todo";
import { createTodo, updateTodo } from "./api";

export function useCreateTodo() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("Creating todo...");
    },
    onError: () => {
      console.log("Error creating todo");
    },
    onSuccess: () => {
      console.log("Todo created successfully");
    },
    onSettled: async (_, err) => {
      // update cache or refetch queries
      if (err) return console.log(err);

      await query.invalidateQueries({ queryKey: ["todos-ids"] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Todo) => await updateTodo(data),

    onSettled: async (_, err, data) => {
      if (err) return console.log(err);

      await queryClient.invalidateQueries({ queryKey: ["todo", data?.id] });
    },
  });
}
