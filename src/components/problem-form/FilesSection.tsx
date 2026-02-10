'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown, Upload, Trash2 } from 'lucide-react'

interface FilesSectionProps {
  isExpanded: boolean
  onToggle: () => void
  composeFileUrls: Record<string, string>
  fileInputName: string
  onFileInputNameChange: (value: string) => void
  uploading: boolean
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  onRemoveFile: (key: string) => void
}

export function FilesSection({
  isExpanded,
  onToggle,
  composeFileUrls,
  fileInputName,
  onFileInputNameChange,
  uploading,
  onFileUpload,
  onRemoveFile,
}: FilesSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader
        className="cursor-pointer"
        onClick={onToggle}
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
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={fileInputName}
                onChange={(e) => onFileInputNameChange(e.target.value)}
                placeholder="e.g., docker-compose.yml"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <label className="relative">
                <input
                  type="file"
                  onChange={onFileUpload}
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
                    onClick={() => onRemoveFile(name)}
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
