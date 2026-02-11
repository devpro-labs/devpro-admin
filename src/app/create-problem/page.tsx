'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateProblemForm } from '@/components/create-problem-form'
import { ProblemRequest } from '@/lib/types'

export default function CreateProblemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ProblemRequest & { _composeFiles?: Record<string, File[]> }) => {
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = sessionStorage.getItem('admin_api_key')

      if (!apiKey) {
        setError('Authentication required. Please login first.')
        router.push('/')
        return
      }

      console.log('[v0] [CreateProblem] Preparing submission with files...')

      // Create FormData for backend
      const formData = new FormData()
      
      // Add problem data as JSON
      formData.append('problem', JSON.stringify(data))

      // Add actual files if they exist
      const composeFiles = (data as any)._composeFiles || {}
      let fileCount = 0
      
      Object.entries(composeFiles).forEach(([key, files]) => {
        if (Array.isArray(files) && files.length > 0) {
          files.forEach((file) => {
            formData.append('composeFiles', file)
            fileCount++
          })
        }
      })

      console.log('[v0] [CreateProblem] Sending with', fileCount, 'files')
      console.log('[v0] [CreateProblem] Data:', data)

      const response = await fetch('http://localhost:9000/api/problems', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formData,
      })

      console.log('[v0] [CreateProblem] Response status:', response.status)

      if (!response.ok) {
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          const json = await response.json()
          throw new Error(json.message || json.error || `HTTP ${response.status}`)
        } else {
          const text = await response.text()
          throw new Error(text || `HTTP ${response.status}`)
        }
      }

      const result = await response.json()
      console.log('[v0] [CreateProblem] Success:', result)
      setError(null)
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('[v0] [CreateProblem] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (<div>
    {error && (<div className="fixed top-4 right-4 p-4 bg-red-900 text-red-100 rounded-lg shadow-lg max-w-md">
      {error} </div>
    )}


    <CreateProblemForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  </div>

  )
}
