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
}

const priorityColors = {
  LOW: 'text-green-600',
  MEDIUM: 'text-yellow-600',
  HIGH: 'text-red-600'
}

const importanceColors = {
  LOW: 'bg-green-100',
  MEDIUM: 'bg-yellow-100',
  HIGH: 'bg-red-100'
}

export default function SortableTodoItem({ todo, onUpdate, onDelete, isInKanban = false }: SortableTodoItemProps) {
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
        className="border rounded-lg p-4 bg-white shadow-sm"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タイトル"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="概要"
            rows={2}
          />
          <div className="flex gap-4">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">優先度: 低</option>
              <option value="MEDIUM">優先度: 中</option>
              <option value="HIGH">優先度: 高</option>
            </select>
            <select
              value={editImportance}
              onChange={(e) => setEditImportance(e.target.value as Importance)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">重要度: 低</option>
              <option value="MEDIUM">重要度: 中</option>
              <option value="HIGH">重要度: 高</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
      className={`border rounded-lg p-3 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
        todo.status === 'DONE' ? 'bg-gray-50 opacity-75' : 'bg-white'
      } ${importanceColors[todo.importance]} ${isDragging ? 'shadow-lg' : ''} hover:shadow-md`}
      {...attributes}
      {...listeners}
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
        <div className="flex-1">
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
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[todo.priority]} bg-white`}>
              優先度: {todo.priority === 'LOW' ? '低' : todo.priority === 'MEDIUM' ? '中' : '高'}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[todo.importance]} bg-white`}>
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
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            disabled={todo.status === 'DONE'}
          >
            編集
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(todo.id)
            }}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}