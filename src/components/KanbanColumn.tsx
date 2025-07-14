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
  theme: 'glass' | 'default' | 'minimal' | 'dark' | 'card3d' | 'modern'
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

  const getColumnClass = () => {
    const baseClass = 'flex flex-col h-full rounded-2xl border transition-all duration-300'
    const hoverClass = isOver || isDraggedOver ? 'border-blue-400/60 bg-blue-50/30' : ''
    
    switch (theme) {
      case 'glass':
        return `${baseClass} ${color} ${hoverClass || 'border-white/30'} shadow-xl bg-white/20 backdrop-blur-md`
      case 'dark':
        return `${baseClass} ${color} ${hoverClass || 'border-gray-600/50'} shadow-xl bg-gray-800/60 backdrop-blur-sm`
      case 'minimal':
        return `${baseClass} ${hoverClass || 'border-gray-900'} border-2 bg-white`
      case 'card3d':
        return `${baseClass} ${color} ${hoverClass || 'border-gray-200'} shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300`
      case 'modern':
        return `${baseClass} ${color} ${hoverClass || 'border-slate-200'} shadow-xl bg-white/95 backdrop-blur-sm`
      default:
        return `${baseClass} ${color} ${hoverClass || 'border-gray-200'} shadow-xl bg-white`
    }
  }
  
  const getHeaderClass = () => {
    switch (theme) {
      case 'glass':
        return 'p-4 border-b border-white/20 bg-white/10 backdrop-blur-sm rounded-t-2xl'
      case 'dark':
        return 'p-4 border-b border-gray-600/30 bg-gray-700/50 backdrop-blur-sm rounded-t-2xl'
      case 'minimal':
        return 'p-4 border-b-2 border-gray-900 bg-white rounded-t-2xl'
      case 'card3d':
        return 'p-4 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl shadow-inner'
      case 'modern':
        return 'p-4 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm rounded-t-2xl'
      default:
        return 'p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl'
    }
  }
  
  const getHeaderTextClass = () => {
    switch (theme) {
      case 'glass':
        return 'text-white drop-shadow-lg'
      case 'dark':
        return 'text-white drop-shadow-lg'
      case 'minimal':
        return 'text-gray-900 font-bold'
      case 'card3d':
        return 'text-gray-800'
      case 'modern':
        return 'text-slate-800'
      default:
        return 'text-gray-800'
    }
  }
  
  const getCounterClass = () => {
    switch (theme) {
      case 'glass':
        return 'text-white/80 bg-white/20 backdrop-blur-sm border border-white/30'
      case 'dark':
        return 'text-gray-300 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50'
      case 'minimal':
        return 'text-gray-900 bg-white border-2 border-gray-900'
      case 'card3d':
        return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-inner'
      case 'modern':
        return 'text-slate-600 bg-slate-100 border border-slate-300'
      default:
        return 'text-gray-500 bg-gray-200 border border-gray-300'
    }
  }
  
  const getEmptyStateTextClass = () => {
    switch (theme) {
      case 'glass':
        return 'text-white/60'
      case 'dark':
        return 'text-gray-400'
      case 'minimal':
        return 'text-gray-900'
      case 'card3d':
        return 'text-gray-500'
      case 'modern':
        return 'text-slate-500'
      default:
        return 'text-gray-400'
    }
  }
  
  return (
    <div
      ref={setNodeRef}
      className={getColumnClass()}
    >
      <div className={getHeaderClass()}>
        <h3 className={`font-semibold flex items-center justify-between ${getHeaderTextClass()}`}>
          {title}
          <span className={`text-xs font-normal px-3 py-1 rounded-full ${getCounterClass()}`}>
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
          <div className={`text-center py-8 ${getEmptyStateTextClass()}`}>
            <div className="text-3xl mb-2">
              {status === 'TODO' && '📝'}
              {status === 'DOING' && '⚡'}
              {status === 'DONE' && '✅'}
            </div>
            <p className={`text-sm ${
              theme === 'glass' ? 'drop-shadow' : ''
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