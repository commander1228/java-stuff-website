import { deleteApi, getApi, postApi } from './api'
import type { CreateTodoType, TodoType } from '@/types/TodoType'

export function createTodoType(todoType: CreateTodoType): Promise<TodoType> {
    return postApi<TodoType,CreateTodoType>('/api/todo-types',todoType)
}

export function getTodoTypes(): Promise<TodoType[]> {
    return getApi<TodoType[]>('/api/todo-types')
}

export function deleteTodoType(id:number): Promise<TodoType> {
    return deleteApi<TodoType>(`/api/todo-types/${id}`)
}