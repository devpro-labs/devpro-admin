'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ProblemRequest, TestCaseRequest, HTTPMethod } from '@/lib/types'
import { BasicInfoSection } from './problem-form/BasicInfoSection'
import { ServicesSection } from './problem-form/ServicesSection'
import { FilesSection } from './problem-form/FilesSection'
import { ResourceLimitsSection } from './problem-form/ResourceLimitsSection'
import { TestCasesSection } from './problem-form/TestCasesSection'

interface CreateProblemFormProps {
  onSubmit: (data: ProblemRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  initialData?: any
  isUpdateMode?: boolean
}

export function CreateProblemForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  isUpdateMode = false,
}: CreateProblemFormProps) {
  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState<ProblemRequest>(() => {
    if (initialData && isUpdateMode) {
      return {
        title: initialData.title || '',
        description: initialData.description || '',
        difficulty: initialData.difficulty || 'Medium',
        tags: initialData.tags || [],
        imageName: initialData.imageName || {
          fastapi: '',
          'express-js': '',
          'express-ts': '',
        },
        entryFile: initialData.entryFile || '',
        services: initialData.services || [],
        keys: initialData.keys || {},
        timeLimitSeconds: initialData.timeLimitSeconds || 30,
        memoryLimitMB: initialData.memoryLimitMB || 256,
        cpuLimit: initialData.cpuLimit || 1.0,
        testCases: initialData.testCases || [],
      }
    }
    return {
      title: '',
      description: '',
      difficulty: 'Medium',
      tags: [],
      imageName: {
        fastapi: '',
        'express-js': '',
        'express-ts': '',
      },
      entryFile: '',
      services: [],
      keys: {},
      timeLimitSeconds: 30,
      memoryLimitMB: 256,
      cpuLimit: 1.0,
      testCases: [],
    }
  })

  // ==================== UI STATE ====================
  const [currentTag, setCurrentTag] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    services: false,
    files: false,
    limits: false,
    testcases: false,
  })

  // ==================== TEST CASE STATE ====================
  const [currentTestCase, setCurrentTestCase] = useState<Partial<TestCaseRequest>>({
    method: 'GET',
    endpoint: '',
    input: {},
    expectedOutput: {},
    expectedStatus: 200,
    isHidden: false,
  })
  const [inputRaw, setInputRaw] = useState('')
  const [outputRaw, setOutputRaw] = useState('')
  const [inputError, setInputError] = useState('')
  const [outputError, setOutputError] = useState('')

  // ==================== FILE UPLOAD STATE ====================
  const [composeFiles, setComposeFiles] = useState<Record<string, File[]>>({
    'js-express': [],
    'ts-express': [],
    'py-fastapi': [],
  })
  const [composeFileUrls, setComposeFileUrls] = useState<Record<string, string[]>>({
    'js-express': [],
    'ts-express': [],
    'py-fastapi': [],
  })
  const [uploading, setUploading] = useState(false)

  // ==================== LOAD INITIAL FILES ====================
  useEffect(() => {
    if (isUpdateMode && initialData?.composeFile) {
      const urlMap: Record<string, string[]> = {
        'js-express': [],
        'ts-express': [],
        'py-fastapi': [],
      }
      
      Object.entries(initialData.composeFile).forEach(([key, url]) => {
        if (key in urlMap && typeof url === 'string') {
          urlMap[key] = [url]
        }
      })
      
      console.log('[v0] [Form] Loaded initial compose files:', urlMap)
      setComposeFileUrls(urlMap)
    }
  }, [isUpdateMode, initialData])

  // ==================== SERVICES STATE ====================
  const [keyInput, setKeyInput] = useState({ key: '', value: '' })

  // ==================== HELPERS: FORM CHANGE ====================
  const handleInputChange = (field: keyof ProblemRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ==================== HELPERS: TAGS ====================
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    handleInputChange(
      'tags',
      formData.tags.filter((t) => t !== tag)
    )
  }

  // ==================== HELPERS: SERVICES ====================
  const addKey = () => {
    if (keyInput.key.trim() && keyInput.value.trim()) {
      handleInputChange('keys', {
        ...formData.keys,
        [keyInput.key]: keyInput.value,
      })
      setKeyInput({ key: '', value: '' })
    }
  }

  const removeKey = (key: string) => {
    const newKeys = { ...formData.keys }
    delete newKeys[key]
    handleInputChange('keys', newKeys)
  }

  // ==================== HELPERS: JSON PARSING ====================
  const handleInputRawChange = (value: string) => {
    setInputRaw(value)
    setInputError('')
    if (!value.trim()) {
      setCurrentTestCase((prev) => ({ ...prev, input: {} }))
      return
    }
    try {
      const parsed = JSON.parse(value)
      setCurrentTestCase((prev) => ({ ...prev, input: parsed }))
    } catch (error) {
      setInputError('Invalid JSON format')
    }
  }

  const handleOutputRawChange = (value: string) => {
    setOutputRaw(value)
    setOutputError('')
    if (!value.trim()) {
      setCurrentTestCase((prev) => ({ ...prev, expectedOutput: {} }))
      return
    }
    try {
      const parsed = JSON.parse(value)
      setCurrentTestCase((prev) => ({ ...prev, expectedOutput: parsed }))
    } catch (error) {
      setOutputError('Invalid JSON format')
    }
  }

  // ==================== HELPERS: TEST CASES ====================
  const addTestCase = () => {
    if (inputError || outputError) {
      alert('Please fix JSON formatting errors before adding test case')
      return
    }

    if (
      currentTestCase.endpoint &&
      currentTestCase.method &&
      currentTestCase.expectedStatus !== undefined
    ) {
      const testCase: TestCaseRequest = {
        method: currentTestCase.method as HTTPMethod,
        endpoint: currentTestCase.endpoint,
        input: currentTestCase.input || {},
        expectedOutput: currentTestCase.expectedOutput || {},
        expectedStatus: currentTestCase.expectedStatus,
        isHidden: currentTestCase.isHidden || false,
      }
      handleInputChange('testCases', [...formData.testCases, testCase])
      resetTestCaseForm()
    }
  }

  const removeTestCase = (index: number) => {
    handleInputChange(
      'testCases',
      formData.testCases.filter((_, i) => i !== index)
    )
  }

  const resetTestCaseForm = () => {
    setCurrentTestCase({
      method: 'GET',
      endpoint: '',
      input: {},
      expectedOutput: {},
      expectedStatus: 200,
      isHidden: false,
    })
    setInputRaw('')
    setOutputRaw('')
    setInputError('')
    setOutputError('')
  }

  // ==================== HELPERS: FILE UPLOAD ====================
  const handleFileUpload = (key: string, file: File) => {
    if (!file) {
      alert('Please select a file')
      return
    }

    console.log('[v0] [handleFileUpload] Adding file for key:', key, 'file:', file.name, 'size:', file.size)

    // Store actual file object
    setComposeFiles((prev) => {
      const newFiles = {
        ...prev,
        [key]: [...(prev[key] || []), file],
      }
      console.log('[v0] [handleFileUpload] Updated composeFiles:', newFiles)
      return newFiles
    })

    // Show file name for visual feedback
    const fileName = file.name
    setComposeFileUrls((prev) => {
      const newUrls = {
        ...prev,
        [key]: [...(prev[key] || []), fileName],
      }
      console.log('[v0] [handleFileUpload] Updated composeFileUrls:', newUrls)
      return newUrls
    })

    console.log(`[v0] File ${file.name} added successfully for ${key}`)
  }

  const removeComposeFile = (key: string, index: number) => {
    setComposeFiles((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }))
    setComposeFileUrls((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }))
  }

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.entryFile) {
      alert('Please fill in all required fields')
      return
    }
    try {
      console.log('[v0] [handleSubmit] Starting submission...')
      console.log('[v0] [handleSubmit] composeFiles:', composeFiles)

      // Convert array-based composeFileUrls to object format for backend
      const composeFileObj: Record<string, string> = {}
      Object.entries(composeFileUrls).forEach(([key, urls]) => {
        if (urls && urls.length > 0) {
          composeFileObj[key] = urls[0] // Use first file for this key (for display)
        }
      })

      console.log('[v0] [handleSubmit] composeFileObj:', composeFileObj)

      const dataToSubmit = {
        ...formData,
        composeFile: Object.keys(composeFileObj).length > 0 ? composeFileObj : {},
        _composeFiles: composeFiles, // Include actual File objects
      }

      console.log('[v0] [handleSubmit] dataToSubmit:', dataToSubmit)
      await onSubmit(dataToSubmit as any)
    } catch (error) {
      console.error('[v0] Form submission error:', error)
    }
  }

  // ==================== RENDER ====================
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
      <BasicInfoSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.basic}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, basic: !prev.basic }))
        }
        currentTag={currentTag}
        onTagInputChange={setCurrentTag}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />

      <ServicesSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.services}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, services: !prev.services }))
        }
        keyInput={keyInput}
        onKeyInputChange={(key, value) => setKeyInput({ key, value })}
        onAddKey={addKey}
        onRemoveKey={removeKey}
      />

      <FilesSection
        isExpanded={expandedSections.files}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, files: !prev.files }))
        }
        composeFileUrls={composeFileUrls}
        uploading={uploading}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeComposeFile}
      />

      <ResourceLimitsSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.limits}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, limits: !prev.limits }))
        }
      />

      <TestCasesSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.testcases}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, testcases: !prev.testcases }))
        }
        currentTestCase={currentTestCase}
        onCurrentTestCaseChange={(field, value) =>
          setCurrentTestCase((prev) => ({ ...prev, [field]: value }))
        }
        inputRaw={inputRaw}
        outputRaw={outputRaw}
        inputError={inputError}
        outputError={outputError}
        onInputRawChange={handleInputRawChange}
        onOutputRawChange={handleOutputRawChange}
        onAddTestCase={addTestCase}
        onRemoveTestCase={removeTestCase}
      />

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {isLoading ? (isUpdateMode ? 'Updating...' : 'Creating...') : (isUpdateMode ? 'Update Problem' : 'Create Problem')}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
