import { NextRequest, NextResponse } from 'next/server'
import { ProblemRequest } from '@/lib/types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000/api'
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] POST /api/problems called')

    // Verify API key
    const apiKey = request.headers.get('X-API-Key')
    if (apiKey !== ADMIN_SECRET) {
      console.log('[v0] Unauthorized: Invalid API key')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const problemJson = formData.get('problem') as string
    const composeEntries = formData.entries()
    const filesWithKeys: { key: string; file: File }[] = []

    for (const [key, value] of composeEntries) {
      if (key.startsWith('composeFiles[') && value instanceof File) {
        const service = key.replace('composeFiles[', '').replace(']', '')
        filesWithKeys.push({ key: service, file: value })
      }
    }


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
filesWithKeys.forEach(({ key, file }) => {
  const renamedFile = new File([file], `${key}.yml`, { type: file.type })
  backendFormData.append('composeFiles', renamedFile)
})

    console.log('[v0] Forwarding to backend:', `${BACKEND_URL}/problems`)

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/problems`, {
      method: 'POST',
      body: backendFormData,
    })

    console.log('[v0] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('[v0] Backend error:', errorText)
      return NextResponse.json(
        { error: errorText || 'Failed to create problem' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating problem:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
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
