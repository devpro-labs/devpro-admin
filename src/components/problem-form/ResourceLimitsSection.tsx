'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-react'
import { ProblemRequest } from '@/lib/types'

interface ResourceLimitsSectionProps {
  formData: ProblemRequest
  onFormChange: (field: keyof ProblemRequest, value: unknown) => void
  isExpanded: boolean
  onToggle: () => void
}

export function ResourceLimitsSection({
  formData,
  onFormChange,
  isExpanded,
  onToggle,
}: ResourceLimitsSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader
        className="cursor-pointer"
        onClick={onToggle}
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
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="timeLimit" className="text-slate-200">
              Time Limit (seconds)
            </Label>
            <Input
              id="timeLimit"
              type="number"
              value={formData.timeLimitSeconds}
              onChange={(e) =>
                onFormChange('timeLimitSeconds', parseInt(e.target.value) || 0)
              }
              min="1"
              max="300"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="memoryLimit" className="text-slate-200">
              Memory Limit (MB)
            </Label>
            <Input
              id="memoryLimit"
              type="number"
              value={formData.memoryLimitMB}
              onChange={(e) =>
                onFormChange('memoryLimitMB', parseInt(e.target.value) || 0)
              }
              min="64"
              max="2048"
              step="64"
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
                onFormChange('cpuLimit', parseFloat(e.target.value) || 0)
              }
              min="0.1"
              max="8"
              step="0.1"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
