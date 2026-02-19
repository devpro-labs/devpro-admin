'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Problem, ProblemRequest, TestCase } from '@/lib/types'

import { BasicInfoSection } from './problem-form/BasicInfoSection'
import { ServicesSection } from './problem-form/ServicesSection'
import { FilesSection } from './problem-form/FilesSection'
import { ResourceLimitsSection } from './problem-form/ResourceLimitsSection'
import { TestCasesSection } from './problem-form/TestCasesSection'

interface UpdateProblemFormProps {
  problem: Problem
  testcases: TestCase[]
  onSubmit: (data: ProblemRequest & { _composeFiles?: Record<string, File[]> }) => Promise<void>
  isLoading?: boolean
  onCancel?: () => void
}

export function UpdateProblemForm({
  problem,
  testcases,
  onSubmit,
  isLoading = false,
  onCancel,
}: UpdateProblemFormProps) {

  // ================= FORM STATE =================
  const [formData, setFormData] = useState<ProblemRequest>({
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
    cpuLimit: 1,
    testCases: [],
  })

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    services: false,
    files: false,
    limits: false,
    testcases: false,
  })

  const [currentTag, setCurrentTag] = useState('')

  // ✅ IMPORTANT: Sync when problem loads
  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || '',
        description: problem.description || '',
        difficulty: problem.difficulty || 'Medium',
        tags: problem.tags || [],
        imageName: problem.imageName || {
          fastapi: '',
          'express-js': '',
          'express-ts': '',
        },
        entryFile: problem.entryFile || '',
        services: problem.services || [],
        keys: problem.keys || {},
        timeLimitSeconds: problem.timeLimitSeconds || 30,
        memoryLimitMB: problem.memoryLimitMB || 256,
        cpuLimit: problem.cpuLimit || 1,
        testCases: testcases || [], // ✅ use backend testcases
      })
    }
  }, [problem, testcases])

  const handleInputChange = (field: keyof ProblemRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }



  // ================= ENV KEY STATE =================
  const [keyInput, setKeyInput] = useState<{ key: string; value: string }>({
    key: '',
    value: '',
  })

  const handleKeyInputChange = (key: string, value: string) => {
    setKeyInput({ key, value })
  }

  const handleAddKey = () => {
    if (!keyInput.key.trim()) return

    setFormData((prev) => ({
      ...prev,
      keys: {
        ...prev.keys,
        [keyInput.key.trim()]: keyInput.value,
      },
    }))

    setKeyInput({ key: '', value: '' })
  }

  const handleRemoveKey = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.keys }
      delete updated[key]
      return { ...prev, keys: updated }
    })
  }


  // ================= TEST CASE STATE =================
  const [currentTestCase, setCurrentTestCase] = useState<Partial<TestCase>>({
    method: 'GET',
    endpoint: '',
    expectedStatus: 200,
    isHidden: false,
  })

  const [inputRaw, setInputRaw] = useState('')
  const [outputRaw, setOutputRaw] = useState('')
  const [inputError, setInputError] = useState('')
  const [outputError, setOutputError] = useState('')

  const handleInputRawChange = (value: string) => {
    setInputRaw(value)

    if (!value.trim()) {
      setInputError('')
      return
    }

    try {
      JSON.parse(value)
      setInputError('')
    } catch {
      setInputError('Invalid JSON')
    }
  }

  const handleOutputRawChange = (value: string) => {
    setOutputRaw(value)

    if (!value.trim()) {
      setOutputError('')
      return
    }

    try {
      JSON.parse(value)
      setOutputError('')
    } catch {
      setOutputError('Invalid JSON')
    }
  }

  const handleCurrentTestCaseChange = (field: string, value: unknown) => {
    setCurrentTestCase((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


  const handleAddTestCase = () => {
    if (!currentTestCase.endpoint?.trim()) return
    if (inputError || outputError) return

    const parsedInput = inputRaw.trim() ? JSON.parse(inputRaw) : {}
    const parsedOutput = outputRaw.trim() ? JSON.parse(outputRaw) : {}

    const newTestCase = {
      ...currentTestCase,
      input: parsedInput,
      expectedOutput: parsedOutput,
    }

    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, newTestCase],
    }))

    // Reset form
    setCurrentTestCase({
      method: 'GET',
      endpoint: '',
      expectedStatus: 200,
      isHidden: false,
    })
    setInputRaw('')
    setOutputRaw('')
  }


  // ================= FILE STATE =================
  const [composeFileUrls, setComposeFileUrls] = useState<Record<string, string[]>>({
    'js-express': [],
    'ts-express': [],
    'py-fastapi': [],
  })

  const [composeFiles, setComposeFiles] = useState<Record<string, File[]>>({
    'js-express': [],
    'ts-express': [],
    'py-fastapi': [],
  })

  const [uploading] = useState(false) // ✅ fixed missing variable

  useEffect(() => {
    if (problem?.imageName) {
      setComposeFileUrls({
        'js-express': problem.imageName['express-js']
          ? [problem.imageName['express-js']]
          : [],
        'ts-express': problem.imageName['express-ts']
          ? [problem.imageName['express-ts']]
          : [],
        'py-fastapi': problem.imageName['fastapi']
          ? [problem.imageName['fastapi']]
          : [],
      })
    }
  }, [problem])

  const handleFileUpload = (key: string, file: File) => {
    setComposeFiles((prev) => ({
      ...prev,
      [key]: [file],
    }))

    setComposeFileUrls((prev) => ({
      ...prev,
      [key]: [file.name],
    }))
  }

  const handleRemoveFile = (key: string) => {
    setComposeFiles((prev) => ({
      ...prev,
      [key]: [],
    }))

    setComposeFileUrls((prev) => ({
      ...prev,
      [key]: [],
    }))

    setFormData((prev) => ({
      ...prev,
      imageName: {
        ...prev.imageName,
        ...(key === 'js-express' && { 'express-js': '' }),
        ...(key === 'ts-express' && { 'express-ts': '' }),
        ...(key === 'py-fastapi' && { fastapi: '' }),
      },
    }))
  }

  // ================= SUBMIT =================
  const [internalLoading, setInternalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Prevent double submit
    if (internalLoading) return;

    setInternalLoading(true);

    try {
      // Remove 'id' from testcases if present
      const cleanedTestCases = formData.testCases.map(({ id, ...rest }) => rest);

      // Prepare the object to submit
      const cleanedData: ProblemRequest & { _composeFiles?: Record<string, File[]> } = {
        ...formData,
        testCases: cleanedTestCases,
        _composeFiles: composeFiles, // attach files here
      };

      await onSubmit(cleanedData); // call parent handler
    } catch (err) {
      console.error('Failed to update problem:', err);
    } finally {
      setInternalLoading(false); // ✅ stop loading
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

      <BasicInfoSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.basic}
        onToggle={() =>
          setExpandedSections((prev) => ({ ...prev, basic: !prev.basic }))
        }
        currentTag={currentTag}
        onTagInputChange={setCurrentTag}
        onAddTag={() => {
          if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            handleInputChange('tags', [...formData.tags, currentTag.trim()])
            setCurrentTag('')
          }
        }}
        onRemoveTag={(tag) =>
          handleInputChange(
            'tags',
            formData.tags.filter((t) => t !== tag)
          )
        }
      />

      <ServicesSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.services}
        onToggle={() =>
          setExpandedSections((prev) => ({
            ...prev,
            services: !prev.services,
          }))
        }
        keyInput={keyInput}
        onKeyInputChange={handleKeyInputChange}
        onAddKey={handleAddKey}
        onRemoveKey={handleRemoveKey}
      />


      <FilesSection
        isExpanded={expandedSections.files}
        onToggle={() =>
          setExpandedSections((prev) => ({
            ...prev,
            files: !prev.files,
          }))
        }
        composeFileUrls={composeFileUrls}
        uploading={uploading}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
      />

      <ResourceLimitsSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.limits}
        onToggle={() =>
          setExpandedSections((prev) => ({
            ...prev,
            limits: !prev.limits,
          }))
        }
      />

      <TestCasesSection
        formData={formData}
        onFormChange={handleInputChange}
        isExpanded={expandedSections.testcases}
        onToggle={() =>
          setExpandedSections((prev) => ({
            ...prev,
            testcases: !prev.testcases,
          }))
        }
        currentTestCase={currentTestCase}
        onCurrentTestCaseChange={handleCurrentTestCaseChange}
        inputRaw={inputRaw}
        outputRaw={outputRaw}
        inputError={inputError}
        outputError={outputError}
        onInputRawChange={handleInputRawChange}
        onOutputRawChange={handleOutputRawChange}
        onAddTestCase={handleAddTestCase}
        onRemoveTestCase={(index) =>
          handleInputChange(
            'testCases',
            formData.testCases.filter((_, i) => i !== index)
          )
        }
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={internalLoading || isLoading}
          className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {(internalLoading || isLoading) && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {internalLoading || isLoading ? 'Updating...' : 'Update Problem'}
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
