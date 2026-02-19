'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateProblemForm } from '@/components/create-problem-form'
import { ProblemRequest } from '@/lib/types'

export default function CreateProblemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
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

    const response = await fetch('http://localhost:9000/api/problems', {
      method: 'POST',
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
