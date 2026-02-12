'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CreateProblemForm } from '@/components/create-problem-form'
import { ProblemRequest } from '@/lib/types'

export default function UpdateProblemPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string

  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('[v0] [UpdateProblem] Fetching problem:', problemId)

        // Fetch problem from Next.js API route
        const response = await fetch(`/api/problems/${problemId}`)

        if (!response.ok) {
          throw new Error('Failed to load problem')
        }

        const data = await response.json()
        console.log('[v0] [UpdateProblem] Problem loaded:', data)
        setProblem(data.data || data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load problem'
        setError(message)
        console.error('[v0] [UpdateProblem] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (problemId) {
      fetchProblem()
    }
  }, [problemId])

  const handleSubmit = async (data: ProblemRequest & { _composeFiles?: Record<string, File[]> }) => {
    try {
      const apiKey = sessionStorage.getItem('admin_api_key')

      if (!apiKey) {
        throw new Error('Authentication required. Please login first.')
      }

      console.log('[v0] [UpdateProblem] Submitting update...')

      // Create FormData for backend
      const formData = new FormData()

      // Extract _composeFiles before creating the problem JSON
      const composeFiles = (data as any)._composeFiles || {}

      // Create problem object without _composeFiles and imageName
      const problemData = { ...data }
      delete (problemData as any)._composeFiles
      delete (problemData as any).imageName

      // Add problem data as a JSON Blob
      const problemBlob = new Blob([JSON.stringify(problemData)], { type: 'application/json' })
      formData.append('problem', problemBlob, 'problem.json')

      // Add files in the correct order
      const fileOrder = ['js-express', 'ts-express', 'py-fastapi']
      let fileCount = 0

      fileOrder.forEach((key) => {
        const files = composeFiles[key]
        if (Array.isArray(files) && files.length > 0) {
          const file = files[0]

          // Create identifiable filename
          let identifiableName = file.name
          if (key === 'js-express' && !identifiableName.toLowerCase().includes('js')) {
            identifiableName = `docker-compose-js-${Date.now()}.yml`
          } else if (key === 'ts-express' && !identifiableName.toLowerCase().includes('ts')) {
            identifiableName = `docker-compose-ts-${Date.now()}.yml`
          } else if (key === 'py-fastapi' && !identifiableName.toLowerCase().includes('py') && !identifiableName.toLowerCase().includes('fastapi')) {
            identifiableName = `docker-compose-py-${Date.now()}.yml`
          }

          const renamedFile = new File([file], identifiableName, { type: file.type })
          formData.append('composeFiles', renamedFile)
          fileCount++
        }
      })

      console.log('[v0] [UpdateProblem] Sending with', fileCount, 'files')

      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'PUT',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formData,
      })

      console.log('[v0] [UpdateProblem] Response status:', response.status)

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to update problem')
      }

      const result = await response.json()
      console.log('[v0] [UpdateProblem] Success:', result)
      alert('Problem updated successfully!')
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      console.error('[v0] [UpdateProblem] Error:', err)
      alert(message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#05060a]">
        <div className="text-white">Loading problem details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#05060a]">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Update Problem</h1>
          <p className="text-gray-400 mt-2">Edit the problem details and test cases</p>
        </div>

        {problem && (
          <CreateProblemForm
            initialData={problem}
            onSubmit={handleSubmit}
            isUpdateMode={true}
          />
        )}
      </div>
    </div>
  )
}
