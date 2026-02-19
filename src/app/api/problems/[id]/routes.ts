import { NextRequest, NextResponse } from 'next/server'
import { ProblemRequest } from '@/lib/types'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000/api'
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

/* ========================== GET ========================== */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/problems/${params.id}`)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    )
  }
}

/* ========================== PUT ========================== */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = request.headers.get('X-API-Key')

    if (apiKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const problemJson = formData.get('problem') as string
    const composeFiles = formData.getAll('composeFiles') as File[]

    if (!problemJson) {
      return NextResponse.json(
        { error: 'Missing problem data' },
        { status: 400 }
      )
    }

    const parsed: ProblemRequest = JSON.parse(problemJson)

    if (!parsed.title || !parsed.description || !parsed.entryFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Forward to Spring Boot
    const backendFormData = new FormData()
    backendFormData.append('problem', JSON.stringify(parsed))

    composeFiles.forEach((file) => {
      backendFormData.append('composeFiles', file)
    })

    const response = await fetch(
      `${BACKEND_URL}/problems/${params.id}`,
      {
        method: 'PUT',
        body: backendFormData,
      }
    )

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { error: text || 'Backend update failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(JSON.parse(text))
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}

/* ========================== DELETE ========================== */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = request.headers.get('X-API-Key')

    if (apiKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${BACKEND_URL}/problems/${params.id}`,
      {
        method: 'DELETE',
      }
    )

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { error: text || 'Delete failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      message: 'Problem deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}
