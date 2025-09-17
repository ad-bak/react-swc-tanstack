import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateTodo } from "../services/mutation";
import { useTodos, useTodosIds } from "../services/queries";
import type { Todo } from "../types/todo";

export default function Todo() {
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);
  const createTodoMutation = useCreateTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>Create Todo</h4>
        <input placeholder="Title" {...register("title")} />
        <br />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input type="submit" disabled={createTodoMutation.isPending} value={createTodoMutation.isPending ? "Creating..." : "Create"} />
      </form>
      <hr />

      {todosQueries.map(({ data }) => (
        <li key={data?.id}>
          <div>
            <p>
              {data?.id} - {data?.title}
            </p>
            <p>{data?.description}</p>
          </div>
        </li>
      ))}
    </>
  );
}
