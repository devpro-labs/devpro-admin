import { NextRequest, NextResponse } from 'next/server'
import { ProblemRequest } from '@/lib/types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000/api'
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching problem:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify API key
    const apiKey = request.headers.get('X-API-Key')
    if (apiKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id
    const data: ProblemRequest = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.entryFile) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, entryFile' },
        { status: 400 }
      )
    }

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Failed to update problem' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating problem:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify API key
    const apiKey = request.headers.get('X-API-Key')
    if (apiKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id

    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete problem' },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: 'Problem deleted successfully' })
  } catch (error) {
    console.error('Error deleting problem:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
