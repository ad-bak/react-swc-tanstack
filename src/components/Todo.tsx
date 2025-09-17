import { useTodos, useTodosIds } from "../services/queries";

export default function Todo() {
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);

  return (
    <>
      {todosQueries.map(({ data }) => (
        <li key={data?.id}>
          <div>
            <p>
              {data?.id} - {data?.title}
            </p>
            <p>{data?.description}</p>
            <hr />
          </div>
        </li>
      ))}
    </>
  );
}
