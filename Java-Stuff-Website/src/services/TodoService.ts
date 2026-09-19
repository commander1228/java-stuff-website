import { getApi, postApi } from "./api";
import type { CreateTodo, Todo } from "@/types/Todo";

export function createTodo(todo: CreateTodo): Promise<Todo> {
    return postApi<Todo,CreateTodo>('/api/todos',todo)
}

export function getTodos(): Promise<Todo[]> {
    return getApi<Todo[]>('/api/todos')
}