import type { TodoType } from './TodoType'

export const Todo_STATUS = ['NOT_STARTED','IN_PROGRESS','COMPLETED'] as const

export type TodoStatus = (typeof Todo_STATUS)[number]

export const Todo_STATUS_LABELS: Record<TodoStatus, string> = {
    NOT_STARTED: 'Not started',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'completed',
}

export interface Todo {
  id: number
  title: string
  description: string
  createdDate: string
  deleted: boolean
  status: TodoStatus
  todoType?: TodoType
}

export interface CreateTodo {
  title: string
  description: string
  todoTypeId?: number
}

export interface UpdateTodo {
  title: string
  description: string
  status: TodoStatus
  todoTypeId?: number
}