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
  theme?: 'glass' | 'default'
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
      className={`border rounded-xl p-4 shadow-lg transition-all duration-300 ${
        theme === 'glass' ? 'backdrop-blur-sm' : ''
      } ${
        todo.status === 'DONE' 
          ? theme === 'glass' 
            ? 'bg-gray-50/40 opacity-75 border-gray-300/50' 
            : 'bg-gray-50 opacity-75 border-gray-300'
          : `${importanceColors[theme][todo.importance]} ${theme === 'glass' ? 'bg-white/40' : 'bg-white'}`
      } ${isDragging ? 'shadow-2xl scale-105' : ''} hover:shadow-xl hover:scale-[1.02] ${
        theme === 'glass' ? 'border-white/40' : 'border-gray-200'
      }`}
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
            todo.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColors[todo.priority]} bg-white/70 backdrop-blur-sm border border-white/30`}>
              優先度: {todo.priority === 'LOW' ? '低' : todo.priority === 'MEDIUM' ? '中' : '高'}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColors[todo.importance]} bg-white/70 backdrop-blur-sm border border-white/30`}>
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
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
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
            className="text-sm text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}