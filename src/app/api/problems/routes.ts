import { NextRequest, NextResponse } from 'next/server'
import { ProblemRequest } from '@/lib/types'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000/api'
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] POST /api/problems called')

    const apiKey = request.headers.get('X-API-Key')
    if (apiKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const incomingFormData = await request.formData()

    const problemJson = incomingFormData.get('problem')
    const composeFiles = incomingFormData.getAll('composeFiles') as File[]

    if (!problemJson) {
      return NextResponse.json(
        { error: 'Missing problem data' },
        { status: 400 }
      )
    }

    // Forward EXACT same multipart to backend
    const backendFormData = new FormData()
    backendFormData.append('problem', problemJson as string)

    composeFiles.forEach((file) => {
      backendFormData.append('composeFiles', file, file.name)
    })

    const response = await fetch(`${BACKEND_URL}/problems`, {
      method: 'POST',
      body: backendFormData,
    })

    const result = await response.text()

    return new NextResponse(result, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[v0] Error creating problem:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/problems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch problems' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
