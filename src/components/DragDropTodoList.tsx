'use client'

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Todo } from '@/types/todo'
import SortableTodoItem from './SortableTodoItem'

interface DragDropTodoListProps {
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  onReorder: (newTodos: Todo[]) => void
}

export default function DragDropTodoList({ 
  todos, 
  onUpdate, 
  onDelete, 
  onReorder 
}: DragDropTodoListProps) {
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id)
      const newIndex = todos.findIndex((todo) => todo.id === over.id)
      
      const newTodos = arrayMove(todos, oldIndex, newIndex)
      onReorder(newTodos)
    }
  }

  // Separate completed and incomplete todos for better UX
  const incompleteTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div className="space-y-3">
      {/* Draggable incomplete todos */}
      {incompleteTodos.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={incompleteTodos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {incompleteTodos.map(todo => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Non-draggable completed todos */}
      {completedTodos.length > 0 && (
        <div className="space-y-3">
          {incompleteTodos.length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">完了済み</h3>
            </div>
          )}
          {completedTodos.map(todo => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}