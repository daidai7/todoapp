import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Priority, Importance } from '@prisma/client'

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, importance } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description: description || '',
        priority: priority as Priority || 'MEDIUM',
        importance: importance as Importance || 'MEDIUM',
      }
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}