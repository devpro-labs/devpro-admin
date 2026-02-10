'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { ProblemRequest, HTTPMethod, TestCaseRequest } from '@/lib/types'

const HTTP_METHODS: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

interface TestCasesSectionProps {
  formData: ProblemRequest
  onFormChange: (field: keyof ProblemRequest, value: unknown) => void
  isExpanded: boolean
  onToggle: () => void
  currentTestCase: Partial<TestCaseRequest>
  onCurrentTestCaseChange: (field: string, value: unknown) => void
  inputRaw: string
  outputRaw: string
  inputError: string
  outputError: string
  onInputRawChange: (value: string) => void
  onOutputRawChange: (value: string) => void
  onAddTestCase: () => void
  onRemoveTestCase: (index: number) => void
}

export function TestCasesSection({
  formData,
  onFormChange,
  isExpanded,
  onToggle,
  currentTestCase,
  onCurrentTestCaseChange,
  inputRaw,
  outputRaw,
  inputError,
  outputError,
  onInputRawChange,
  onOutputRawChange,
  onAddTestCase,
  onRemoveTestCase,
}: TestCasesSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader
        className="cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Test Cases</CardTitle>
            <CardDescription>
              {formData.testCases.length} test case(s) added
            </CardDescription>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Test Case Form */}
          <div className="space-y-4 p-4 bg-slate-800 rounded border border-slate-700">
            <h4 className="text-slate-200 font-semibold">Add New Test Case</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="method" className="text-slate-200">
                  HTTP Method
                </Label>
                <select
                  id="method"
                  value={currentTestCase.method || 'GET'}
                  onChange={(e) =>
                    onCurrentTestCaseChange('method', e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  {HTTP_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
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
                  value={currentTestCase.endpoint || ''}
                  onChange={(e) =>
                    onCurrentTestCaseChange('endpoint', e.target.value)
                  }
                  placeholder="/api/users"
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
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
                onChange={(e) => onInputRawChange(e.target.value)}
                placeholder='{"name": "John", "email": "john@example.com"}'
                rows={3}
                className={`mt-1 bg-slate-700 border-slate-600 text-white font-mono text-sm ${
                  inputError ? 'border-red-500' : ''
                }`}
              />
              <p className="text-slate-500 text-xs mt-1">
                Enter valid JSON or leave empty for empty object
              </p>
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
                onChange={(e) => onOutputRawChange(e.target.value)}
                placeholder='{"id": 1, "name": "John", "email": "john@example.com"}'
                rows={3}
                className={`mt-1 bg-slate-700 border-slate-600 text-white font-mono text-sm ${
                  outputError ? 'border-red-500' : ''
                }`}
              />
              <p className="text-slate-500 text-xs mt-1">
                Enter valid JSON or leave empty for empty object
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-slate-200">
                  Expected Status Code
                </Label>
                <Input
                  id="status"
                  type="number"
                  value={currentTestCase.expectedStatus || 200}
                  onChange={(e) =>
                    onCurrentTestCaseChange('expectedStatus', parseInt(e.target.value))
                  }
                  min="100"
                  max="599"
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTestCase.isHidden || false}
                    onChange={(e) =>
                      onCurrentTestCaseChange('isHidden', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-slate-200">Hidden Test Case</span>
                </label>
              </div>
            </div>

            <Button
              type="button"
              onClick={onAddTestCase}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Test Case
            </Button>
          </div>

          {/* Added Test Cases */}
          {formData.testCases.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-slate-200 font-semibold">Added Test Cases</h4>
              {formData.testCases.map((tc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400">
                        {tc.method}
                      </Badge>
                      <p className="text-slate-300 font-mono text-sm">{tc.endpoint}</p>
                      {tc.isHidden && (
                        <Badge variant="secondary" className="bg-red-600 text-white">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Expected Status: {tc.expectedStatus}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveTestCase(index)}
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
  )
}
