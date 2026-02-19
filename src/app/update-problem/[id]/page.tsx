'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UpdateProblemForm } from '@/components/update-problem-form'
import { Problem, TestCase, ProblemRequest } from '@/lib/types'


const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000/api'

export default function UpdateProblemPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.id as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [testcases, setTestcases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const apiKey = sessionStorage.getItem('admin_api_key')

        const res = await fetch(`${BACKEND_URL}/problems/${problemId}`, {
          headers: { 'X-API-Key': apiKey || '' }
        })

        const data = await res.json()

        console.log('API RESPONSE:', data)

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch problem')
        }

        // ✅ FIXED HERE (lowercase data)
       const problemData = data?.DATA?.problem
       const testcaseData = data?.DATA?.testcases || []

        if (!problemData) {
          throw new Error('Problem not found in response')
        }

        setProblem(problemData)
        setTestcases(testcaseData)

      } catch (error) {
        console.error('Fetch error:', error)
        setProblem(null)
      } finally {
        setLoading(false)
      }
    }

    if (problemId) fetchProblem()
  }, [problemId])

  const handleUpdate = async (
    data: ProblemRequest & { _composeFiles?: Record<string, File[]> }
    ) => {
      setIsLoading(true)
      setError(null)
    
      try {
        const apiKey = sessionStorage.getItem('admin_api_key')
    
        if (!apiKey) {
          setError('Authentication required. Please login first.')
          router.push('/')
          return
        }
    
        const formData = new FormData()
    
        const composeFiles = data._composeFiles || {}
    
        const problemData = { ...data }
        delete (problemData as any)._composeFiles
        delete (problemData as any).imageName
    
        // ✅ Send JSON as string
        formData.append('problem', JSON.stringify(problemData))
    
        const fileOrder = ['js-express', 'ts-express', 'py-fastapi']
        let fileCount = 0
    
        fileOrder.forEach((key) => {
          const files = composeFiles[key]
          if (Array.isArray(files) && files.length > 0) {
            const file = files[0]
    
            let identifiableName = file.name
    
            if (key === 'js-express')
              identifiableName = `docker-compose-js-${Date.now()}.yml`
            else if (key === 'ts-express')
              identifiableName = `docker-compose-ts-${Date.now()}.yml`
            else if (key === 'py-fastapi')
              identifiableName = `docker-compose-py-${Date.now()}.yml`
    
            const renamedFile = new File([file], identifiableName, {
              type: file.type,
            })
    
            formData.append('composeFiles', renamedFile)
            fileCount++
          }
        })
    
        if (fileCount < 3) {
          setError(`Please upload docker-compose files for all 3 frameworks.`)
          return
        }
    
        const response = await fetch(`${BACKEND_URL}/problems/${problemId}`, {
          method: 'PUT',
          headers: {
            'X-API-Key': apiKey,
          },
          body: formData,
        })
    
        if (!response.ok) {
          const text = await response.text()
          throw new Error(text)
        }
    
        await response.json()
        router.push('/')
    
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setIsLoading(false)
      }
    }
  if (loading)
    return <div className="text-white p-10">Loading...</div>

  if (!problem)
    return <div className="text-white p-10">Problem not found</div>

  return (
    <UpdateProblemForm
      problem={problem}
      testcases={testcases}   // ✅ pass testcases
      onSubmit={handleUpdate}
    />
  )
}
