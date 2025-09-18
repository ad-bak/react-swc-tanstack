import { useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateTodo, useUpdateTodo, useDeleteTodo } from "../services/mutation";
import { useTodos } from "../services/queries";
import type { CreateTodoData } from "../types/todo";

export default function Todo() {
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const todosQuery = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodomu = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit, reset } = useForm<CreateTodoData>();

  const handleCreateTodoSubmit: SubmitHandler<CreateTodoData> = (data) => {
    createTodoMutation.mutate(data, {
      onSuccess: () => {
        reset(); // Clear form on success
      },
    });
  };

  const handleUpdateTodo = (todoId: number, updates: Partial<CreateTodoData>) => {
    const existingTodo = todos.find(todo => todo.id === todoId);
    if (!existingTodo) return;

    // Clear existing timer for this todo
    const existingTimer = debounceTimers.current.get(todoId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer - only send request after user stops clicking
    const timer = setTimeout(() => {
      updateTodomu.mutate({
        ...existingTodo,
        ...updates
      });
      debounceTimers.current.delete(todoId);
    }, 300); // 300ms delay

    debounceTimers.current.set(todoId, timer);
  };

  const handleDeleteTodo = (todoId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTodoMutation.mutate(todoId);
    }
  };

  if (todosQuery.isLoading) {
    return <div>Loading todos...</div>;
  }

  if (todosQuery.error) {
    return <div>Error loading todos: {todosQuery.error.message}</div>;
  }

  const todos = todosQuery.data || [];

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>Create Todo</h4>
        <input placeholder="Title" {...register("title", { required: true })} />
        <br />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input type="submit" disabled={createTodoMutation.isPending} value={createTodoMutation.isPending ? "Creating..." : "Create"} />
      </form>
      <hr />

      {todos.map((todo) => (
        <li key={todo.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={todo.checked}
              onChange={() => handleUpdateTodo(todo.id, { checked: !todo.checked })}
            />
            <div style={{ flex: 1 }}>
              <p>
                {todo.id} - {todo.title}
              </p>
              <p>{todo.description}</p>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id, todo.title)}
              disabled={deleteTodoMutation.isPending}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: deleteTodoMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {deleteTodoMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </>
  );
}
