'use client'

import { useState } from 'react'
import { Priority, Importance } from '@prisma/client'
import { CreateTodoRequest } from '@/types/todo'

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => void
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [importance, setImportance] = useState<Importance>('MEDIUM')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      importance
    })

    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setImportance('MEDIUM')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* First row: Title, Priority, Importance, Button */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="新しいタスクを入力..."
            required
          />
        </div>
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
        >
          <option value="LOW">優先度:低</option>
          <option value="MEDIUM">優先度:中</option>
          <option value="HIGH">優先度:高</option>
        </select>

        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value as Importance)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
        >
          <option value="LOW">重要度:低</option>
          <option value="MEDIUM">重要度:中</option>
          <option value="HIGH">重要度:高</option>
        </select>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-sm whitespace-nowrap"
        >
          + 追加
        </button>
      </div>

      {/* Second row: Description */}
      <div className="flex">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          placeholder="詳細説明を入力してください（オプション）..."
          rows={2}
        />
      </div>
    </form>
  )
}