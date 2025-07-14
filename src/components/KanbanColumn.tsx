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
  theme: 'glass' | 'default'
}

export default function KanbanColumn({
  status,
  title,
  color,
  todos,
  onUpdate,
  onDelete,
  isDraggedOver,
  theme
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
  })

  const isGlassTheme = theme === 'glass'
  
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-2xl border ${color} ${
        isOver || isDraggedOver ? 'border-blue-400/60 bg-blue-50/30' : isGlassTheme ? 'border-white/30' : 'border-gray-200'
      } transition-all duration-300 shadow-xl ${
        isGlassTheme ? 'bg-white/20 backdrop-blur-md' : 'bg-white'
      }`}
    >
      <div className={`p-4 border-b rounded-t-2xl ${
        isGlassTheme ? 'border-white/20 bg-white/10 backdrop-blur-sm' : 'border-gray-200 bg-gray-50'
      }`}>
        <h3 className={`font-semibold flex items-center justify-between ${
          isGlassTheme ? 'text-white drop-shadow-lg' : 'text-gray-800'
        }`}>
          {title}
          <span className={`text-xs font-normal px-3 py-1 rounded-full ${
            isGlassTheme 
              ? 'text-white/80 bg-white/20 backdrop-blur-sm border border-white/30' 
              : 'text-gray-500 bg-gray-200 border border-gray-300'
          }`}>
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
                theme={theme}
              />
            ))}
          </div>
        </SortableContext>
        
        {todos.length === 0 && (
          <div className={`text-center py-8 ${
            isGlassTheme ? 'text-white/60' : 'text-gray-400'
          }`}>
            <div className="text-3xl mb-2">
              {status === 'TODO' && '📝'}
              {status === 'DOING' && '⚡'}
              {status === 'DONE' && '✅'}
            </div>
            <p className={`text-sm ${
              isGlassTheme ? 'drop-shadow' : ''
            }`}>
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