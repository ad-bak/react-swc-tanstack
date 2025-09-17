import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateTodo } from "../services/mutation";
import { useTodos } from "../services/queries";
import type { CreateTodoData } from "../types/todo";

export default function Todo() {
  const todosQuery = useTodos();
  const createTodoMutation = useCreateTodo();

  const { register, handleSubmit, reset } = useForm<CreateTodoData>();

  const handleCreateTodoSubmit: SubmitHandler<CreateTodoData> = (data) => {
    createTodoMutation.mutate(data, {
      onSuccess: () => {
        reset(); // Clear form on success
      },
    });
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
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "Creating..." : "Create"}
        />
      </form>
      <hr />

      {todos.map((todo) => (
        <li key={todo.id}>
          <div>
            <p>
              {todo.id} - {todo.title}
            </p>
            <p>{todo.description}</p>
          </div>
        </li>
      ))}
    </>
  );
}
