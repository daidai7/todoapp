import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Status } from '@prisma/client'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { todoId, status, targetPosition }: { 
      todoId: string, 
      status: Status, 
      targetPosition?: number 
    } = body

    // Update the todo's status
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { 
        status,
        // Reset completed flag based on status
        completed: status === 'DONE',
        // If targetPosition is provided, update order
        ...(targetPosition !== undefined && { order: targetPosition })
      }
    })

    // If targetPosition is provided, reorder other todos in the same status
    if (targetPosition !== undefined) {
      // Get all todos with the same status
      const todosInStatus = await prisma.todo.findMany({
        where: { 
          status,
          id: { not: todoId }
        },
        orderBy: { order: 'asc' }
      })

      // Update orders for todos after the target position
      const updatePromises = todosInStatus
        .filter((_, index) => index >= targetPosition)
        .map((todo, index) =>
          prisma.todo.update({
            where: { id: todo.id },
            data: { order: targetPosition + index + 1 }
          })
        )

      await Promise.all(updatePromises)
    }

    // Return all todos with updated order
    const todos = await prisma.todo.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to update todo status:', error)
    return NextResponse.json({ error: 'Failed to update todo status' }, { status: 500 })
  }
}