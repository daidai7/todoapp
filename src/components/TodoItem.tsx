'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { Priority, Importance } from '@prisma/client'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
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

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editImportance, setEditImportance] = useState<Importance>(todo.importance)

  const handleToggleComplete = () => {
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
      <div className="border rounded-lg p-4 bg-white shadow-sm">
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
    <div className={`border rounded-lg p-4 shadow-sm transition-all ${
      todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
    } ${importanceColors[todo.importance]}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <h3 className={`font-semibold ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="flex gap-3 mt-2">
            <span className={`text-xs font-medium ${priorityColors[todo.priority]}`}>
              優先度: {todo.priority === 'LOW' ? '低' : todo.priority === 'MEDIUM' ? '中' : '高'}
            </span>
            <span className={`text-xs font-medium ${priorityColors[todo.importance]}`}>
              重要度: {todo.importance === 'LOW' ? '低' : todo.importance === 'MEDIUM' ? '中' : '高'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            disabled={todo.completed}
          >
            編集
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}