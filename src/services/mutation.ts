import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo, deleteTodo } from "./api";
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
    onMutate: async (updatedTodo) => {
      // Cancel outgoing queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: todoKeys.all });
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(updatedTodo.id) });

      // Get current data for rollback
      const previousTodos = queryClient.getQueryData(todoKeys.lists());
      const previousTodo = queryClient.getQueryData(todoKeys.detail(updatedTodo.id));

      // Optimistically update todos list
      if (previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), (old: any) =>
          old?.map((todo: any) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
      }

      // Optimistically update individual todo cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);

      return { previousTodos, previousTodo };
    },
    onError: (error, updatedTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData(todoKeys.detail(updatedTodo.id), context.previousTodo);
      }
      console.error("Error updating todo:", error);
    },
    onSettled: (_, __, updatedTodo) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(updatedTodo.id) });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
    },
  });
}
