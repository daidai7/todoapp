'use client'

import { useState, useEffect } from 'react'
import TodoForm from '@/components/TodoForm'
import TodoItem from '@/components/TodoItem'
import { Todo, CreateTodoRequest } from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600">
            タスクを管理して効率的に作業を進めましょう
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TodoForm onSubmit={createTodo} />
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  タスク一覧
                </h2>
                <span className="text-sm text-gray-500">
                  {todos.filter(todo => !todo.completed).length} / {todos.length} 件
                </span>
              </div>

              {todos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-gray-500">まだタスクがありません</p>
                  <p className="text-sm text-gray-400 mt-1">
                    左のフォームから新しいタスクを追加してください
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}