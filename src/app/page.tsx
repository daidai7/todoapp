'use client'

import { useState, useEffect } from 'react'
import TodoForm from '@/components/TodoForm'
import KanbanBoard from '@/components/KanbanBoard'
import { Todo, CreateTodoRequest } from '@/types/todo'
import { Status } from '@prisma/client'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'glass' | 'default'>('glass')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTodo = async (todoData: CreateTodoRequest) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })
      
      if (response.ok) {
        const newTodo = await response.json()
        setTodos(prev => [newTodo, ...prev])
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo))
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setTodos(prev => prev.filter(todo => todo.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const reorderTodos = async (newTodos: Todo[]) => {
    // Optimistically update the UI
    setTodos(newTodos)
    
    try {
      // Find all todos that have different order than before
      const changedTodos = newTodos.filter(newTodo => {
        const oldTodo = todos.find(t => t.id === newTodo.id)
        return oldTodo && oldTodo.order !== newTodo.order
      })
      
      if (changedTodos.length > 0) {
        // Get the status of the changed todos (they should all have the same status)
        const status = changedTodos[0].status
        
        // Get all todos with the same status from the new array, sorted by order
        const statusTodos = newTodos
          .filter(todo => todo.status === status)
          .sort((a, b) => a.order - b.order)
        
        const todoIds = statusTodos.map(todo => todo.id)
        
        const response = await fetch('/api/todos/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todoIds }),
        })
        
        if (response.ok) {
          const updatedTodos = await response.json()
          setTodos(updatedTodos)
        } else {
          console.error('Failed to reorder todos - reverting')
          // Revert on error
          fetchTodos()
        }
      }
    } catch (error) {
      console.error('Failed to reorder todos:', error)
      // Revert on error
      fetchTodos()
    }
  }

  const changeStatus = async (todoId: string, newStatus: Status, targetPosition?: number) => {
    try {
      const response = await fetch('/api/todos/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todoId, status: newStatus, targetPosition }),
      })
      
      if (response.ok) {
        const updatedTodos = await response.json()
        setTodos(updatedTodos)
      }
    } catch (error) {
      console.error('Failed to change todo status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-lg text-white drop-shadow-lg">読み込み中...</div>
      </div>
    )
  }

  const isGlassTheme = theme === 'glass'
  
  return (
    <div className={`min-h-screen ${isGlassTheme ? 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500' : 'bg-gray-50'} relative`}>
      {isGlassTheme && <div className="absolute inset-0 bg-black/20"></div>}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Header with inline form */}
        <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 ${isGlassTheme ? 'bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30' : 'bg-white rounded-lg shadow-sm'} p-6 gap-6`}>
          <div className="flex items-center space-x-6 lg:w-1/3">
            <div>
              <h1 className={`text-2xl font-bold ${isGlassTheme ? 'text-white drop-shadow-lg' : 'text-gray-900'}`}>
                Todo Kanban Board
              </h1>
              <p className={`text-sm ${isGlassTheme ? 'text-white/80 drop-shadow' : 'text-gray-600'}`}>
                タスクをドラッグ&ドロップして進捗を管理
              </p>
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <TodoForm onSubmit={createTodo} theme={theme} />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="h-[calc(100vh-14rem)]">
          {todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">まだタスクがありません</p>
              <p className="text-sm text-gray-400 mt-1">
                右上のフォームから新しいタスクを追加してください
              </p>
            </div>
          ) : (
            <KanbanBoard
              todos={todos}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onStatusChange={changeStatus}
              onReorder={reorderTodos}
              theme={theme}
            />
          )}
        </div>
        
        {/* Theme Selector */}
        <div className="fixed bottom-4 left-4">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'glass' | 'default')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              isGlassTheme 
                ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' 
                : 'bg-white border border-gray-300 text-gray-800'
            } shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            <option value="glass" className="text-black">ガラスモーフィズム</option>
            <option value="default" className="text-black">デフォルト</option>
          </select>
        </div>
      </div>
    </div>
  )
}