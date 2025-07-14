'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '@/types/todo'
import { Priority, Importance } from '@prisma/client'

interface SortableTodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  isInKanban?: boolean
  theme?: 'glass' | 'default' | 'minimal' | 'dark' | 'card3d' | 'modern'
}

const priorityColors = {
  LOW: 'text-green-600',
  MEDIUM: 'text-yellow-600',
  HIGH: 'text-red-600'
}

const importanceColors = {
  glass: {
    LOW: 'bg-green-100/30 border-green-300/50',
    MEDIUM: 'bg-yellow-100/30 border-yellow-300/50',
    HIGH: 'bg-red-100/30 border-red-300/50'
  },
  default: {
    LOW: 'bg-green-100',
    MEDIUM: 'bg-yellow-100',
    HIGH: 'bg-red-100'
  },
  minimal: {
    LOW: 'bg-green-300',
    MEDIUM: 'bg-yellow-300',
    HIGH: 'bg-red-300'
  },
  dark: {
    LOW: 'bg-green-600/50 border-green-500/50',
    MEDIUM: 'bg-yellow-600/50 border-yellow-500/50',
    HIGH: 'bg-red-600/50 border-red-500/50'
  },
  card3d: {
    LOW: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    MEDIUM: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    HIGH: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
  },
  modern: {
    LOW: 'bg-emerald-50 border-emerald-200',
    MEDIUM: 'bg-amber-50 border-amber-200',
    HIGH: 'bg-rose-50 border-rose-200'
  }
}

export default function SortableTodoItem({ todo, onUpdate, onDelete, isInKanban = false, theme = 'glass' }: SortableTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editImportance, setEditImportance] = useState<Importance>(todo.importance)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleToggleComplete = () => {
    if (isInKanban) {
      // In kanban mode, don't use checkbox - status is managed by drag and drop
      return
    }
    onUpdate(todo.id, { completed: !todo.completed })
  }

  const handleSaveEdit = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      importance: editImportance
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setEditPriority(todo.priority)
    setEditImportance(todo.importance)
    setIsEditing(false)
  }
  
  const getCardClass = () => {
    const baseClass = 'border p-4 transition-all duration-300'
    const importanceClass = importanceColors[theme][todo.importance]
    const dragClass = isDragging ? 'shadow-2xl scale-105' : ''
    const hoverClass = 'hover:shadow-xl hover:scale-[1.02]'
    
    switch (theme) {
      case 'glass':
        return `${baseClass} rounded-xl shadow-lg backdrop-blur-sm ${
          todo.status === 'DONE' 
            ? 'bg-gray-50/40 opacity-75 border-gray-300/50' 
            : `${importanceClass} bg-white/40 border-white/40`
        } ${dragClass} ${hoverClass}`
      case 'dark':
        return `${baseClass} rounded-xl shadow-lg backdrop-blur-sm ${
          todo.status === 'DONE' 
            ? 'bg-gray-700/40 opacity-75 border-gray-600/50' 
            : `${importanceClass} bg-gray-800/60 border-gray-600/50`
        } ${dragClass} ${hoverClass}`
      case 'minimal':
        return `${baseClass} rounded-lg border-2 ${
          todo.status === 'DONE' 
            ? 'bg-gray-200 opacity-75 border-gray-400' 
            : `${importanceClass} border-gray-900`
        } ${dragClass} ${hoverClass}`
      case 'card3d':
        return `${baseClass} rounded-2xl shadow-2xl ${
          todo.status === 'DONE' 
            ? 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-75 border-gray-300' 
            : `${importanceClass}`
        } ${dragClass} hover:shadow-3xl hover:translate-y-[-6px] transform transition-all duration-300`
      case 'modern':
        return `${baseClass} rounded-2xl shadow-xl backdrop-blur-sm ${
          todo.status === 'DONE' 
            ? 'bg-slate-100/40 opacity-75 border-slate-300/50' 
            : `${importanceClass}`
        } ${dragClass} ${hoverClass}`
      default:
        return `${baseClass} rounded-xl shadow-lg ${
          todo.status === 'DONE' 
            ? 'bg-gray-50 opacity-75 border-gray-300' 
            : `${importanceClass}`
        } ${dragClass} ${hoverClass}`
    }
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border rounded-xl p-4 bg-white/40 backdrop-blur-sm shadow-lg border-white/40"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-600"
            placeholder="タイトル"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-600"
            placeholder="概要"
            rows={2}
          />
          <div className="flex gap-4">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              <option value="LOW" className="text-black">優先度: 低</option>
              <option value="MEDIUM" className="text-black">優先度: 中</option>
              <option value="HIGH" className="text-black">優先度: 高</option>
            </select>
            <select
              value={editImportance}
              onChange={(e) => setEditImportance(e.target.value as Importance)}
              className="p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              <option value="LOW" className="text-black">重要度: 低</option>
              <option value="MEDIUM" className="text-black">重要度: 中</option>
              <option value="HIGH" className="text-black">重要度: 高</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/30 text-gray-800 rounded-lg hover:bg-white/50 transition-all duration-300"
            >
              保存
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-gray-800 rounded-lg hover:bg-white/40 transition-all duration-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getCardClass()}
      {...attributes}
    >
      <div className="flex items-start gap-3">
        {!isInKanban && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        )}
        <div 
          className="flex-1" 
          {...listeners} 
          style={{ cursor: 'grab' }}
          onDoubleClick={(e) => {
            e.stopPropagation()
            if (todo.status !== 'DONE') {
              setIsEditing(true)
            }
          }}
        >
          <h3 className={`font-semibold ${
            todo.status === 'DONE' 
              ? 'line-through text-gray-500' 
              : theme === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.status === 'DONE' 
                ? 'line-through text-gray-400' 
                : theme === 'dark' 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColors[todo.priority]} ${
              theme === 'dark' 
                ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-600/50' 
                : 'bg-white/70 backdrop-blur-sm border border-white/30'
            }`}>
              優先度: {todo.priority === 'LOW' ? '低' : todo.priority === 'MEDIUM' ? '中' : '高'}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColors[todo.importance]} ${
              theme === 'dark' 
                ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-600/50' 
                : 'bg-white/70 backdrop-blur-sm border border-white/30'
            }`}>
              重要度: {todo.importance === 'LOW' ? '低' : todo.importance === 'MEDIUM' ? '中' : '高'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className={`text-sm transition-colors px-2 py-1 rounded-lg backdrop-blur-sm ${
              theme === 'dark' 
                ? 'text-blue-400 hover:text-blue-300 bg-gray-800/60 border border-gray-600/50 hover:bg-gray-700/70' 
                : 'text-blue-600 hover:text-blue-800 bg-white/50 border border-white/30 hover:bg-white/70'
            }`}
            disabled={todo.status === 'DONE'}
          >
            編集
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`「${todo.title}」を削除してもよろしいですか？`)) {
                onDelete(todo.id)
              }
            }}
            className={`text-sm transition-colors px-2 py-1 rounded-lg backdrop-blur-sm ${
              theme === 'dark' 
                ? 'text-red-400 hover:text-red-300 bg-gray-800/60 border border-gray-600/50 hover:bg-gray-700/70' 
                : 'text-red-600 hover:text-red-800 bg-white/50 border border-white/30 hover:bg-white/70'
            }`}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}