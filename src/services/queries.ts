import { useQuery } from "@tanstack/react-query";
import { getTodos, getTodo } from "./api";
import { todoKeys } from "./queryKeys";

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: getTodos,
    staleTime: 1 * 60 * 1000, // 1 minute is sufficient
  });
}

export function useTodo(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodo(id),
    staleTime: 1 * 60 * 1000,
  });
}
