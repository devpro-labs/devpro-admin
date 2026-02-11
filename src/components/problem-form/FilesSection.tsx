'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, Trash2 } from 'lucide-react'

const COMPOSE_FILE_KEYS = [
  { key: 'js-express', label: 'Express.js' },
  { key: 'ts-express', label: 'Express.js (TypeScript)' },
  { key: 'py-fastapi', label: 'FastAPI (Python)' },
]

interface FilesSectionProps {
  isExpanded: boolean
  onToggle: () => void
  composeFileUrls: Record<string, string[]>
  uploading: boolean
  onFileUpload: (key: string, file: File) => void
  onRemoveFile: (key: string, index: number) => void
}

import { ChevronDown } from 'lucide-react'

export function FilesSection({
  isExpanded,
  onToggle,
  composeFileUrls,
  uploading,
  onFileUpload,
  onRemoveFile,
}: FilesSectionProps) {
  const [selectedKey, setSelectedKey] = useState('js-express')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('[v0] [FilesSection] Adding file:', file.name, 'for key:', selectedKey)
    onFileUpload(selectedKey, file)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Docker Compose Files</CardTitle>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <p className="text-slate-400 text-sm">
            Select a framework and upload its docker-compose.yml file
          </p>

          <div className="space-y-3">
            <Label htmlFor="framework-select" className="text-slate-200">
              Framework
            </Label>
            <select
              id="framework-select"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COMPOSE_FILE_KEYS.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            accept=".yml,.yaml,.json"
          />

          <Button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Processing...' : 'Choose docker-compose File'}
          </Button>

          {Object.entries(composeFileUrls).some(([, files]) => files.length > 0) && (
            <div className="space-y-3 mt-4">
              <Label className="text-slate-200">Uploaded Files</Label>
              {COMPOSE_FILE_KEYS.map(({ key, label }) => {
                const files = composeFileUrls[key] || []
                if (files.length === 0) return null

                return (
                  <div key={key} className="bg-slate-800 rounded border border-slate-700 p-3">
                    <p className="text-slate-300 font-semibold text-sm mb-2">{label}</p>
                    <div className="space-y-1">
                      {files.map((fileUrl, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-700 p-2 rounded text-sm"
                        >
                          <p className="text-slate-300 font-mono truncate">
                            {fileUrl.split('/').pop() || 'docker-compose.yml'}
                          </p>
                          <button
                            type="button"
                            onClick={() => onRemoveFile(key, index)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
