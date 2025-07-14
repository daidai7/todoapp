import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { todoIds }: { todoIds: string[] } = body

    // Update order for the provided todos
    const updatePromises = todoIds.map((id, index) =>
      prisma.todo.update({
        where: { id },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    // Return all todos in the correct order
    const todos = await prisma.todo.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to reorder todos:', error)
    return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 })
  }
}