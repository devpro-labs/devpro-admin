'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateProblemForm } from '@/components/create-problem-form'
import { ProblemRequest } from '@/lib/types'

export default function CreateProblemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ProblemRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = sessionStorage.getItem('admin_api_key')

      if (!apiKey) {
        setError('Authentication required. Please login first.')
        router.push('/')
        return
      }

      const response = await fetch('http://localhost:9000/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create problem')
      }

      const result = await response.json()
      console.log('Problem created:', result)

      // Redirect to problem list or detail page
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Error creating problem:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div>
      {error && (
        <div className="fixed top-4 right-4 p-4 bg-red-900 text-red-100 rounded-lg shadow-lg max-w-md">
          {error}
        </div>
      )}
      <CreateProblemForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  )
}
