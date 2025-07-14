'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Todo } from '@/types/todo'
import { Status } from '@prisma/client'
import SortableTodoItem from './SortableTodoItem'

interface KanbanColumnProps {
  status: Status
  title: string
  color: string
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  isDraggedOver: boolean
}

export default function KanbanColumn({
  status,
  title,
  color,
  todos,
  onUpdate,
  onDelete,
  isDraggedOver
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-lg border-2 ${color} ${
        isOver || isDraggedOver ? 'border-blue-400 bg-blue-50' : ''
      } transition-colors shadow-sm bg-white`}
    >
      <div className="p-3 border-b bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
        <h3 className="font-semibold text-gray-800 flex items-center justify-between">
          {title}
          <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </h3>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {todos.map(todo => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isInKanban={true}
              />
            ))}
          </div>
        </SortableContext>
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">
              {status === 'TODO' && '📝'}
              {status === 'DOING' && '⚡'}
              {status === 'DONE' && '✅'}
            </div>
            <p className="text-sm">
              {status === 'TODO' && 'タスクをここにドロップ'}
              {status === 'DOING' && '進行中のタスクなし'}
              {status === 'DONE' && '完了したタスクなし'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}