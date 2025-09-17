interface TodoBase {
  checked: boolean;
  title: string;
  description: string;
}

interface Todo extends TodoBase {
  id: number;
}

interface CreateTodoData extends TodoBase {
  id?: number;
}

export type { Todo, CreateTodoData };
