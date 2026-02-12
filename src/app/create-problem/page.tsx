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
      console.log('[v0] [CreateProblem] Data:', data)

      // Create FormData for backend
      const formData = new FormData()
      
      // Extract _composeFiles before creating the problem JSON
      const composeFiles = (data as any)._composeFiles || {}
      
      // Create problem object without _composeFiles and imageName (backend doesn't need these)
      const problemData = { ...data }
      delete (problemData as any)._composeFiles
      delete (problemData as any).imageName
      
      console.log('[v0] [CreateProblem] Problem data to send:', problemData)
      
      // Add problem data as a JSON Blob (not string) - this is important!
      const problemBlob = new Blob([JSON.stringify(problemData)], { type: 'application/json' })
      formData.append('problem', problemBlob, 'problem.json')

      // Add files in the correct order: js-express, ts-express, py-fastapi
      const fileOrder = ['js-express', 'ts-express', 'py-fastapi']
      let fileCount = 0
      
      fileOrder.forEach((key) => {
        const files = composeFiles[key]
        if (Array.isArray(files) && files.length > 0) {
          // Only take the first file for each key
          const file = files[0]
          
          // Create a new File object with a name the backend can identify
          // Backend checks: filename.contains("js"), .contains("ts"), .contains("py") or .contains("fastapi")
          let identifiableName = file.name
          if (key === 'js-express' && !identifiableName.toLowerCase().includes('js')) {
            identifiableName = `docker-compose-js-${Date.now()}.yml`
          } else if (key === 'ts-express' && !identifiableName.toLowerCase().includes('ts')) {
            identifiableName = `docker-compose-ts-${Date.now()}.yml`
          } else if (key === 'py-fastapi' && !identifiableName.toLowerCase().includes('py') && !identifiableName.toLowerCase().includes('fastapi')) {
            identifiableName = `docker-compose-py-${Date.now()}.yml`
          }
          
          // Create a new File with the identifiable name
          const renamedFile = new File([file], identifiableName, { type: file.type })
          formData.append('composeFiles', renamedFile)
          fileCount++
          console.log('[v0] [CreateProblem] Adding file:', identifiableName, 'for key:', key)
        }
      })

      console.log('[v0] [CreateProblem] Sending with', fileCount, 'files')
      
      // Validate that we have all required files
      if (fileCount < 3) {
        setError(`Please upload docker-compose files for all 3 frameworks. Currently have ${fileCount}/3 files.`)
        setIsLoading(false)
        return
      }

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
