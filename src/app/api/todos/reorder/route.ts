import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { todoIds }: { todoIds: string[] } = body

    // Update order for all todos based on the new order
    const updatePromises = todoIds.map((id, index) =>
      prisma.todo.update({
        where: { id },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    // Return updated todos in the new order
    const todos = await prisma.todo.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' }
      ]
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to reorder todos:', error)
    return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 })
  }
}