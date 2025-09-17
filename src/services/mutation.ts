import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo } from "./api";
import { todoKeys } from "./queryKeys";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onError: (error) => {
      console.error("Error creating todo:", error);
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (_, updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(updatedTodo.id) });
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
    },
  });
}
