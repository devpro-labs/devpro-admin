'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Plus, X } from 'lucide-react'
import { ProblemRequest } from '@/lib/types'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const FRAMEWORKS = [
  { key: 'fastapi', label: 'FastAPI (Python)' },
  { key: 'express-js', label: 'Express.js' },
  { key: 'express-ts', label: 'Express.js (TypeScript)' },
]

interface BasicInfoSectionProps {
  formData: ProblemRequest
  onFormChange: (field: keyof ProblemRequest, value: unknown) => void
  isExpanded: boolean
  onToggle: () => void
  currentTag: string
  onTagInputChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
}

export function BasicInfoSection({
  formData,
  onFormChange,
  isExpanded,
  onToggle,
  currentTag,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: BasicInfoSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader
        className="cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Basic Information</CardTitle>
            <CardDescription>
              Problem title, description, and difficulty level
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
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-slate-200">
              Problem Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormChange('title', e.target.value)}
              placeholder="Create a User Registration API"
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
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="Describe what the user needs to build..."
              rows={4}
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-slate-200">
              Difficulty Level
            </Label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => onFormChange('difficulty', e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-slate-200">Framework Docker Images</Label>
            <p className="text-slate-400 text-sm mb-3">
              Add Docker images for each supported framework
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="framework-select" className="text-slate-300 text-sm">
                  Select Framework
                </Label>
                <select
                  id="framework-select"
                  className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => {
                    const key = e.target.value
                    const imageName = (formData.imageName as Record<string, string>) || {}
                    const value = imageName[key] || ''
                    
                    const input = document.getElementById('framework-image-input') as HTMLInputElement
                    if (input) {
                      input.value = value
                    }
                    
                    const frameworkLabel = document.getElementById('framework-label')
                    if (frameworkLabel) {
                      const label = FRAMEWORKS.find(f => f.key === key)?.label || ''
                      frameworkLabel.textContent = `${label} Image URL`
                    }
                  }}
                >
                  <option value="">Choose a framework...</option>
                  {FRAMEWORKS.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="framework-image-input" id="framework-label" className="text-slate-300 text-sm">
                  Image URL
                </Label>
                <Input
                  id="framework-image-input"
                  placeholder="e.g., registry.io/my-framework:latest"
                  className="mt-1 bg-slate-800 border-slate-700 text-white"
                  onChange={(e) => {
                    const frameworkSelect = document.getElementById('framework-select') as HTMLSelectElement
                    const key = frameworkSelect?.value
                    if (key) {
                      const currentImages = (formData.imageName as Record<string, string>) || {}
                      onFormChange('imageName', {
                        ...currentImages,
                        [key]: e.target.value,
                      })
                    }
                  }}
                />
              </div>

              {Object.entries((formData.imageName as Record<string, string>) || {}).filter(([_, v]) => v).length > 0 && (
                <div className="bg-slate-800 rounded border border-slate-700 p-3 mt-4">
                  <Label className="text-slate-200 text-sm">Configured Images</Label>
                  <div className="space-y-1 mt-2">
                    {Object.entries((formData.imageName as Record<string, string>) || {}).map(
                      ([key, value]) =>
                        value && (
                          <div key={key} className="flex items-center justify-between bg-slate-700 p-2 rounded text-sm">
                            <div>
                              <p className="text-slate-300 font-semibold">{FRAMEWORKS.find(f => f.key === key)?.label}</p>
                              <p className="text-slate-400 text-xs truncate">{value}</p>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="entryFile" className="text-slate-200">
              Entry File *
            </Label>
            <Input
              id="entryFile"
              value={formData.entryFile}
              onChange={(e) => onFormChange('entryFile', e.target.value)}
              placeholder="src/index.js"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200">Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={currentTag}
                onChange={(e) => onTagInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onAddTag()
                  }
                }}
                placeholder="Add a tag..."
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <button
                type="button"
                onClick={onAddTag}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-indigo-600 text-white flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(tag)}
                      className="ml-1 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
