'use client'

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Todo } from '@/types/todo'
import { Status } from '@prisma/client'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  onStatusChange: (todoId: string, newStatus: Status, targetPosition?: number) => void
  onReorder: (newTodos: Todo[]) => void
}

const statusConfig = {
  TODO: { title: 'Todo', color: 'bg-blue-100 border-blue-200' },
  DOING: { title: 'Doing', color: 'bg-yellow-100 border-yellow-200' },
  DONE: { title: 'Done', color: 'bg-green-100 border-green-200' }
}

export default function KanbanBoard({ 
  todos, 
  onUpdate, 
  onDelete, 
  onStatusChange, 
  onReorder 
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    const todo = todos.find(t => t.id === event.active.id)
    setDraggedTodo(todo || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If dragging over a column (status change)
    if (overId.startsWith('column-')) {
      const newStatus = overId.replace('column-', '') as Status
      const activeTodo = todos.find(todo => todo.id === activeId)
      
      if (activeTodo && activeTodo.status !== newStatus) {
        // Calculate target position (end of the column)
        const todosInTarget = todos.filter(todo => todo.status === newStatus)
        const targetPosition = todosInTarget.length
        
        onStatusChange(activeId, newStatus, targetPosition)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedTodo(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If dropping on a column (status change)
    if (overId.startsWith('column-')) {
      const newStatus = overId.replace('column-', '') as Status
      const activeTodo = todos.find(todo => todo.id === activeId)
      
      if (activeTodo && activeTodo.status !== newStatus) {
        // Calculate target position (end of the column)
        const todosInTarget = todos.filter(todo => todo.status === newStatus)
        const targetPosition = todosInTarget.length
        
        onStatusChange(activeId, newStatus, targetPosition)
      }
      return
    }

    // If dropping on another todo (reordering within same status)
    if (activeId !== overId) {
      const activeTodo = todos.find(todo => todo.id === activeId)
      const overTodo = todos.find(todo => todo.id === overId)
      
      if (activeTodo && overTodo && activeTodo.status === overTodo.status) {
        // Get todos in the same status, sorted by current order
        const statusTodos = todos
          .filter(todo => todo.status === activeTodo.status)
          .sort((a, b) => a.order - b.order)
        
        const oldIndex = statusTodos.findIndex(todo => todo.id === activeId)
        const newIndex = statusTodos.findIndex(todo => todo.id === overId)
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reorderedStatusTodos = arrayMove(statusTodos, oldIndex, newIndex)
          
          // Create the complete updated todos array
          const newTodos = todos.map(todo => {
            if (todo.status === activeTodo.status) {
              const newOrder = reorderedStatusTodos.findIndex(t => t.id === todo.id)
              return { ...todo, order: newOrder }
            }
            return todo
          })
          
          onReorder(newTodos)
        }
      }
    }
  }

  const todosByStatus = {
    TODO: todos.filter(todo => todo.status === 'TODO').sort((a, b) => a.order - b.order),
    DOING: todos.filter(todo => todo.status === 'DOING').sort((a, b) => a.order - b.order),
    DONE: todos.filter(todo => todo.status === 'DONE').sort((a, b) => a.order - b.order)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {Object.entries(statusConfig).map(([status, config]) => (
          <KanbanColumn
            key={status}
            status={status as Status}
            title={config.title}
            color={config.color}
            todos={todosByStatus[status as Status]}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isDraggedOver={activeId !== null && draggedTodo?.status !== status}
          />
        ))}
      </div>
    </DndContext>
  )
}