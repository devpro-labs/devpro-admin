'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Problem, ProblemRequest, ServiceType, HTTPMethod, TestCaseRequest } from '@/lib/types'
import { ChevronDown, Plus, Trash2, X, Upload } from 'lucide-react'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const SERVICES: ServiceType[] = ['REDIS', 'POSTGRES', 'MONGODB', 'AUTH', 'REST']
const HTTP_METHODS: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

interface UpdateProblemFormProps {
  problem: Problem
  onSubmit: (data: ProblemRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function UpdateProblemForm({
  problem,
  onSubmit,
  onCancel,
  isLoading = false,
}: UpdateProblemFormProps) {
  const [formData, setFormData] = useState<ProblemRequest>({
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: [],
    imageName: problem.imageName,
    entryFile: problem.entryFile,
    services: problem.services,
    keys: problem.keys,
    timeLimitSeconds: problem.timeLimitSeconds,
    memoryLimitMB: problem.memoryLimitMB,
    cpuLimit: problem.cpuLimit,
    composeFile: {},
    testCases: problem.testCases.map((tc) => ({
      method: tc.method,
      endpoint: tc.endpoint,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      expectedStatus: tc.expectedStatus,
      isHidden: tc.isHidden,
    })),
  })

  const [currentTag, setCurrentTag] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    services: false,
    files: false,
    limits: false,
    testcases: false,
  })
  const [currentTestCase, setCurrentTestCase] = useState<Partial<TestCaseRequest>>({
    method: 'GET',
    endpoint: '',
    input: {},
    expectedOutput: {},
    expectedStatus: 200,
    isHidden: false,
  })
  const [keyInput, setKeyInput] = useState({ key: '', value: '' })
  const [inputRaw, setInputRaw] = useState('')
  const [outputRaw, setOutputRaw] = useState('')
  const [inputError, setInputError] = useState('')
  const [outputError, setOutputError] = useState('')
  const [composeFileUrls, setComposeFileUrls] = useState<Record<string, string>>({})
  const [fileInputName, setFileInputName] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (problem.composeFile) {
      setComposeFileUrls(problem.composeFile)
    }
  }, [problem])

  const handleInputChange = (field: keyof ProblemRequest, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.entryFile) {
      alert('Please fill in all required fields')
      return
    }
    try {
      const dataToSubmit = {
        ...formData,
        composeFile: Object.keys(composeFileUrls).length > 0 ? composeFileUrls : undefined,
      }
      await onSubmit(dataToSubmit)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !fileInputName.trim()) {
      alert('Please enter a file name')
      return
    }

    setUploading(true)
    try {
      const formDataToUpload = new FormData()
      formDataToUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setComposeFileUrls((prev) => ({
        ...prev,
        [fileInputName]: data.url,
      }))
      setFileInputName('')
      e.target.value = ''
    } catch (error) {
      console.error('File upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeComposeFile = (key: string) => {
    setComposeFileUrls((prev) => {
      const newFiles = { ...prev }
      delete newFiles[key]
      return newFiles
    })
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag)) {
      handleInputChange('tags', [...formData.tags, currentTag])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter((t) => t !== tag))
  }

  const toggleService = (service: ServiceType) => {
    const newServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service]
    handleInputChange('services', newServices)
  }

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

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Update Problem</h1>
          <p className="text-slate-400">Update problem configuration and test cases</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('basic')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription>Title, description, and difficulty</CardDescription>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSections.basic ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSections.basic && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-200">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., REST API User Management"
                    className="mt-1 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-200">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed problem description..."
                    rows={5}
                    className="mt-1 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty" className="text-slate-200">
                      Difficulty
                    </Label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="entryFile" className="text-slate-200">
                      Entry File *
                    </Label>
                    <Input
                      id="entryFile"
                      value={formData.entryFile}
                      onChange={(e) => handleInputChange('entryFile', e.target.value)}
                      placeholder="e.g., index.js"
                      className="mt-1 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-200 mb-2 block">Tags</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add a tag"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Services Configuration */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('services')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Services & Configuration</CardTitle>
                  <CardDescription>
                    Microservices and environment configuration
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSections.services ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSections.services && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-200 mb-3 block">
                    Required Services
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICES.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`p-3 rounded-md border-2 transition-all ${
                          formData.services.includes(service)
                            ? 'bg-blue-900 border-blue-600 text-blue-100'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-200 mb-3 block">
                    Environment Variables
                  </Label>
                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <Input
                        value={keyInput.key}
                        onChange={(e) =>
                          setKeyInput((prev) => ({
                            ...prev,
                            key: e.target.value,
                          }))
                        }
                        placeholder="Variable name"
                        className="bg-slate-800 border-slate-700 text-white flex-1"
                      />
                      <Input
                        value={keyInput.value}
                        onChange={(e) =>
                          setKeyInput((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        placeholder="Value"
                        className="bg-slate-800 border-slate-700 text-white flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addKey}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.keys).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700"
                      >
                        <div>
                          <span className="text-slate-300 font-mono">{key}</span>
                          <span className="text-slate-500 mx-2">=</span>
                          <span className="text-slate-400 font-mono">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeKey(key)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Docker Compose Files */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader
              className="cursor-pointer"
              onClick={() => 
                setExpandedSections((prev) => ({
                  ...prev,
                  files: !prev.files,
                }))
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Docker Compose Files</CardTitle>
                  <CardDescription>
                    Upload docker-compose.yml and other configuration files
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSections.files ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSections.files && (
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={fileInputName}
                      onChange={(e) => setFileInputName(e.target.value)}
                      placeholder="e.g., docker-compose.yml"
                      className="bg-slate-800 border-slate-700 text-white flex-1"
                    />
                    <label className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading || !fileInputName.trim()}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).closest('label')?.querySelector('input[type="file"]') as HTMLInputElement
                          input?.click()
                        }}
                        disabled={uploading || !fileInputName.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </label>
                  </div>
                </div>
                {Object.entries(composeFileUrls).length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-200">Uploaded Files</Label>
                    {Object.entries(composeFileUrls).map(([name, url]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700"
                      >
                        <div className="flex-1">
                          <p className="text-slate-300 font-mono text-sm">{name}</p>
                          <p className="text-slate-500 text-xs truncate">{url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeComposeFile(name)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Resource Limits */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('limits')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Resource Limits</CardTitle>
                  <CardDescription>
                    Time, memory, and CPU constraints
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSections.limits ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSections.limits && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="timeLimitSeconds" className="text-slate-200">
                      Time Limit (seconds)
                    </Label>
                    <Input
                      id="timeLimitSeconds"
                      type="number"
                      value={formData.timeLimitSeconds}
                      onChange={(e) =>
                        handleInputChange('timeLimitSeconds', parseInt(e.target.value))
                      }
                      min="1"
                      className="mt-1 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="memoryLimitMB" className="text-slate-200">
                      Memory Limit (MB)
                    </Label>
                    <Input
                      id="memoryLimitMB"
                      type="number"
                      value={formData.memoryLimitMB}
                      onChange={(e) =>
                        handleInputChange('memoryLimitMB', parseInt(e.target.value))
                      }
                      min="64"
                      className="mt-1 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpuLimit" className="text-slate-200">
                      CPU Limit (cores)
                    </Label>
                    <Input
                      id="cpuLimit"
                      type="number"
                      value={formData.cpuLimit}
                      onChange={(e) =>
                        handleInputChange('cpuLimit', parseFloat(e.target.value))
                      }
                      step="0.1"
                      min="0.1"
                      className="mt-1 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Test Cases */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('testcases')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Test Cases</CardTitle>
                  <CardDescription>
                    Define test cases with REST API endpoints
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSections.testcases ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSections.testcases && (
              <CardContent className="space-y-6">
                {/* Add New Test Case */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-slate-200 font-semibold mb-4">Add Test Case</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="method" className="text-slate-200">
                          HTTP Method
                        </Label>
                        <select
                          id="method"
                          value={currentTestCase.method}
                          onChange={(e) =>
                            setCurrentTestCase((prev) => ({
                              ...prev,
                              method: e.target.value as HTTPMethod,
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                        >
                          {HTTP_METHODS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="endpoint" className="text-slate-200">
                          Endpoint
                        </Label>
                        <Input
                          id="endpoint"
                          value={currentTestCase.endpoint}
                          onChange={(e) =>
                            setCurrentTestCase((prev) => ({
                              ...prev,
                              endpoint: e.target.value,
                            }))
                          }
                          placeholder="/api/users"
                          className="mt-1 bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedStatus" className="text-slate-200">
                          Expected Status Code
                        </Label>
                        <Input
                          id="expectedStatus"
                          type="number"
                          value={currentTestCase.expectedStatus}
                          onChange={(e) =>
                            setCurrentTestCase((prev) => ({
                              ...prev,
                              expectedStatus: parseInt(e.target.value),
                            }))
                          }
                          className="mt-1 bg-slate-800 border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <input
                            type="checkbox"
                            checked={currentTestCase.isHidden || false}
                            onChange={(e) =>
                              setCurrentTestCase((prev) => ({
                                ...prev,
                                isHidden: e.target.checked,
                              }))
                            }
                            className="mr-2"
                          />
                          Hidden Test Case
                        </Label>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-200">
                        Request Input (JSON)
                        {inputError && (
                          <span className="text-red-400 text-sm ml-2">{inputError}</span>
                        )}
                      </Label>
                      <Textarea
                        value={inputRaw}
                        onChange={(e) => handleInputRawChange(e.target.value)}
                        placeholder='{"name": "John", "email": "john@example.com"}'
                        rows={3}
                        className={`mt-1 bg-slate-800 border-slate-700 text-white font-mono text-sm ${
                          inputError ? 'border-red-500' : ''
                        }`}
                      />
                      <p className="text-slate-500 text-xs mt-1">Enter valid JSON or leave empty for empty object</p>
                    </div>

                    <div>
                      <Label className="text-slate-200">
                        Expected Output (JSON)
                        {outputError && (
                          <span className="text-red-400 text-sm ml-2">{outputError}</span>
                        )}
                      </Label>
                      <Textarea
                        value={outputRaw}
                        onChange={(e) => handleOutputRawChange(e.target.value)}
                        placeholder='{"id": 1, "name": "John", "email": "john@example.com", "status": "active"}'
                        rows={3}
                        className={`mt-1 bg-slate-800 border-slate-700 text-white font-mono text-sm ${
                          outputError ? 'border-red-500' : ''
                        }`}
                      />
                      <p className="text-slate-500 text-xs mt-1">Enter valid JSON or leave empty for empty object</p>
                    </div>

                    <Button
                      type="button"
                      onClick={addTestCase}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test Case
                    </Button>
                  </div>
                </div>

                {/* Test Cases List */}
                {formData.testCases.length > 0 && (
                  <div>
                    <h3 className="text-slate-200 font-semibold mb-3">
                      Test Cases ({formData.testCases.length})
                    </h3>
                    <div className="space-y-3">
                      {formData.testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-800 rounded border border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-600">{tc.method}</Badge>
                              <span className="text-slate-300 font-mono">{tc.endpoint}</span>
                              {tc.isHidden && (
                                <Badge className="bg-yellow-600">Hidden</Badge>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTestCase(idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-slate-400 text-xs">
                            Status: {tc.expectedStatus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Updating...' : 'Update Problem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
