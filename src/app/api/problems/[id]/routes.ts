import { NextRequest, NextResponse } from 'next/server'
import { ProblemRequest } from '@/lib/types'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000/api'
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log('[v0] [GET] Fetching problem:', id, 'from:', `${BACKEND_URL}/problems/${id}`)

    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] [GET] Response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[v0] [GET] Problem data retrieved successfully')
    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] [GET] Error fetching problem:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
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
      console.log('[v0] [PUT] Unauthorized: Invalid API key')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id
    console.log('[v0] [PUT] Updating problem:', id)

    // Parse multipart form data
    const formData = await request.formData()
    const problemJson = formData.get('problem') as string
    const composeFiles = formData.getAll('composeFiles') as File[]

    console.log('[v0] [PUT] Received problem data and files:', composeFiles.length)

    if (!problemJson) {
      return NextResponse.json(
        { error: 'Missing problem data' },
        { status: 400 }
      )
    }

    const data = JSON.parse(problemJson) as ProblemRequest

    // Validate required fields
    if (!data.title || !data.description || !data.entryFile) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, entryFile' },
        { status: 400 }
      )
    }

    // Prepare multipart form for backend
    const backendFormData = new FormData()
    backendFormData.append('problem', JSON.stringify(data))

    // Add files if present
    composeFiles.forEach((file) => {
      backendFormData.append('composeFiles', file)
    })

    console.log('[v0] [PUT] Forwarding to backend:', `${BACKEND_URL}/problems/${id}`)

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'PUT',
      body: backendFormData,
    })

    console.log('[v0] [PUT] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('[v0] [PUT] Backend error:', errorText)
      return NextResponse.json(
        { error: errorText || 'Failed to update problem' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[v0] [PUT] Success:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] [PUT] Error updating problem:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
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
      console.log('[v0] [DELETE] Unauthorized: Invalid API key')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id
    console.log('[v0] [DELETE] Deleting problem:', id)

    const response = await fetch(`${BACKEND_URL}/problems/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] [DELETE] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('[v0] [DELETE] Backend error:', errorText)
      return NextResponse.json(
        { error: errorText || 'Failed to delete problem' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[v0] [DELETE] Success:', result)
    return NextResponse.json({ message: 'Problem deleted successfully', data: result })
  } catch (error) {
    console.error('[v0] [DELETE] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
