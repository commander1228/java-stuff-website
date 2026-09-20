import { deleteApi, getApi, postApi, putApi } from './api'
import type { CreateTodo, Todo } from '@/types/Todo'

export function createTodo(todo: CreateTodo): Promise<Todo> {
    return postApi<Todo,CreateTodo>('/api/todos',todo)
}

export function getTodos(): Promise<Todo[]> {
    return getApi<Todo[]>('/api/todos')
}

export function deleteTodo(id: number): Promise<Todo> {
    return deleteApi<Todo>(`/api/todos/${id}`)
}

export function updateTodo(id: number, todo: Todo): Promise<Todo> {
    return putApi<Todo,Todo>(`/api/todos/${id}`,todo)
}