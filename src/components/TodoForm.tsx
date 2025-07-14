'use client'

import { useState } from 'react'
import { Priority, Importance } from '@prisma/client'
import { CreateTodoRequest } from '@/types/todo'

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => void
  theme: 'glass' | 'default'
}

export default function TodoForm({ onSubmit, theme }: TodoFormProps) {
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

  const isGlassTheme = theme === 'glass'
  
  return (
    <div className={isGlassTheme ? 'bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6' : 'bg-gray-50 rounded-lg p-4'}>
      <form onSubmit={handleSubmit} className="space-y-4">
      {/* First row: Title, Priority, Importance, Button */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${
              isGlassTheme
                ? 'border-white/50 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
            }`}
            placeholder="新しいタスクを入力..."
            required
          />
        </div>
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={`p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm min-w-[120px] ${
            isGlassTheme
              ? 'border-white/50 bg-white/40 backdrop-blur-sm text-gray-800'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
        >
          <option value="LOW" className="text-black">優先度:低</option>
          <option value="MEDIUM" className="text-black">優先度:中</option>
          <option value="HIGH" className="text-black">優先度:高</option>
        </select>

        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value as Importance)}
          className={`p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm min-w-[120px] ${
            isGlassTheme
              ? 'border-white/50 bg-white/40 backdrop-blur-sm text-gray-800'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
        >
          <option value="LOW" className="text-black">重要度:低</option>
          <option value="MEDIUM" className="text-black">重要度:中</option>
          <option value="HIGH" className="text-black">重要度:高</option>
        </select>
        
        <button
          type="submit"
          className={`px-6 py-3 rounded-xl hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 font-medium text-sm whitespace-nowrap shadow-lg ${
            isGlassTheme
              ? 'bg-white/30 backdrop-blur-sm border border-white/50 text-gray-800'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          + 追加
        </button>
      </div>

      {/* Second row: Description */}
      <div className="flex">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none ${
            isGlassTheme
              ? 'border-white/50 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600'
              : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
          }`}
          placeholder="詳細説明を入力してください（オプション）..."
          rows={2}
        />
      </div>
    </form>
    </div>
  )
}