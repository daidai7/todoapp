import { Priority, Importance, Status } from '@prisma/client'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  importance: Importance
  status: Status
  completed: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoRequest {
  title: string
  description?: string
  priority?: Priority
  importance?: Importance
  status?: Status
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  priority?: Priority
  importance?: Importance
  status?: Status
  completed?: boolean
}