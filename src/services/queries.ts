import { useQueries, useQuery } from "@tanstack/react-query";
import { getTodo, getTodosIds } from "./api";

export function useTodosIds() {
  return useQuery({
    queryKey: ["todos-ids"],
    queryFn: getTodosIds,
  });
}

export function useTodos(ids: (number | undefined)[] | undefined) {
  return useQueries({
    queries: (ids ?? [])?.map((id) => {
      return {
        queryKey: ["todo", id],
        queryFn: () => getTodo(id!),
        // cache for 5 minutes
        staleTime: 5 * 60 * 1000,
      };
    }),
  });
}
