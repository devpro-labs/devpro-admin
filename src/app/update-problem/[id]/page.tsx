'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UpdateProblemForm } from '@/components/update-problem-form'
import { ProblemRequest, Problem } from '@/lib/types'

export default function UpdateProblemPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)

        const apiKey = sessionStorage.getItem('admin_api_key')

      if (!apiKey) {
        setError('Authentication required. Please login first.')
        router.push('/')
        return
      }
        const response = await fetch('http://localhost:9000/api/problems/${problemId}')
        if (!response.ok) throw new Error('Failed to fetch problem')
        const data = await response.json()
        setProblem(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load problem')
      } finally {
        setLoading(false)
      }
    }

    if (problemId) {
      fetchProblem()
    }
  }, [problemId])

  const handleSubmit = async (data: ProblemRequest) => {
    try {
      const apiKey = sessionStorage.getItem('admin_api_key')

      if (!apiKey) {
        setError('Authentication required. Please login first.')
        router.push('/')
        return
      }

      setSubmitting(true)
      const response = await fetch('http://localhost:9000/api/problems/${problemId}', {
        method: 'PUT',
       headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update problem')
      
      alert('Problem updated successfully!')
      router.push('/')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update problem')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading problem...</div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'Problem not found'}</div>
      </div>
    )
  }

  return (
    <UpdateProblemForm
      problem={problem}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isLoading={submitting}
    />
  )
}
