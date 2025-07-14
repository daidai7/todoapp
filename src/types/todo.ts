import { Priority, Importance } from '@prisma/client'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  importance: Importance
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoRequest {
  title: string
  description?: string
  priority?: Priority
  importance?: Importance
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  priority?: Priority
  importance?: Importance
  completed?: boolean
}