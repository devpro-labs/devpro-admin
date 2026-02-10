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

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="imageName" className="text-slate-200">
                Image Name
              </Label>
              <Input
                id="imageName"
                value={formData.imageName}
                onChange={(e) => onFormChange('imageName', e.target.value)}
                placeholder="registry/image:tag"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
              />
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
