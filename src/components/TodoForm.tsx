'use client'

import { useState } from 'react'
import { Priority, Importance } from '@prisma/client'
import { CreateTodoRequest } from '@/types/todo'

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => void
  theme: 'glass' | 'default' | 'minimal' | 'dark' | 'card3d' | 'modern'
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

  const getFormContainerClass = () => {
    switch (theme) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6'
      case 'dark':
        return 'bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-600/50 p-6'
      case 'minimal':
        return 'bg-white rounded-lg border-2 border-gray-300 p-4'
      case 'card3d':
        return 'bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-6 transform hover:scale-[1.01] transition-transform duration-300'
      case 'modern':
        return 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6'
      default:
        return 'bg-gray-50 rounded-lg p-4'
    }
  }
  
  const getInputClass = () => {
    switch (theme) {
      case 'glass':
        return 'border-white/50 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600'
      case 'dark':
        return 'border-gray-600/50 bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400'
      case 'minimal':
        return 'border-2 border-gray-900 bg-white text-gray-900 placeholder-gray-500'
      case 'card3d':
        return 'border-gray-300 bg-gradient-to-br from-white to-gray-50 text-gray-900 placeholder-gray-500 shadow-inner transform focus:scale-[1.02] transition-transform duration-200'
      case 'modern':
        return 'border-slate-300 bg-white/80 text-slate-800 placeholder-slate-500'
      default:
        return 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
    }
  }
  
  const getButtonClass = () => {
    switch (theme) {
      case 'glass':
        return 'bg-white/30 backdrop-blur-sm border border-white/50 text-gray-800 hover:bg-white/50'
      case 'dark':
        return 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500'
      case 'minimal':
        return 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900'
      case 'card3d':
        return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-2xl hover:translate-y-[-4px] border border-blue-500 transform transition-all duration-300'
      case 'modern':
        return 'bg-slate-700 text-white hover:bg-slate-800 border border-slate-600'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700'
    }
  }
  
  return (
    <div className={getFormContainerClass()}>
      <form onSubmit={handleSubmit} className="space-y-4">
      {/* First row: Title, Priority, Importance, Button */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${getInputClass()}`}
            placeholder="新しいタスクを入力..."
            required
          />
        </div>
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={`p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm min-w-[120px] ${getInputClass()}`}
        >
          <option value="LOW" className="text-black">優先度:低</option>
          <option value="MEDIUM" className="text-black">優先度:中</option>
          <option value="HIGH" className="text-black">優先度:高</option>
        </select>

        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value as Importance)}
          className={`p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm min-w-[120px] ${getInputClass()}`}
        >
          <option value="LOW" className="text-black">重要度:低</option>
          <option value="MEDIUM" className="text-black">重要度:中</option>
          <option value="HIGH" className="text-black">重要度:高</option>
        </select>
        
        <button
          type="submit"
          className={`px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 font-medium text-sm whitespace-nowrap shadow-lg ${getButtonClass()}`}
        >
          + 追加
        </button>
      </div>

      {/* Second row: Description */}
      <div className="flex">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none ${getInputClass()}`}
          placeholder="詳細説明を入力してください（オプション）..."
          rows={2}
        />
      </div>
    </form>
    </div>
  )
}