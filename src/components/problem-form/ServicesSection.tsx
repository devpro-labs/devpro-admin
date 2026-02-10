'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { ProblemRequest, ServiceType } from '@/lib/types'

const SERVICES: ServiceType[] = ['REDIS', 'POSTGRES', 'MONGODB', 'AUTH', 'REST']

interface ServicesSectionProps {
  formData: ProblemRequest
  onFormChange: (field: keyof ProblemRequest, value: unknown) => void
  isExpanded: boolean
  onToggle: () => void
  keyInput: { key: string; value: string }
  onKeyInputChange: (key: string, value: string) => void
  onAddKey: () => void
  onRemoveKey: (key: string) => void
}

export function ServicesSection({
  formData,
  onFormChange,
  isExpanded,
  onToggle,
  keyInput,
  onKeyInputChange,
  onAddKey,
  onRemoveKey,
}: ServicesSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader
        className="cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Services & Configuration</CardTitle>
            <CardDescription>
              Required services and environment variables
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
            <Label className="text-slate-200 block mb-3">
              Required Services
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={(e) => {
                      const newServices = e.target.checked
                        ? [...formData.services, service]
                        : formData.services.filter((s) => s !== service)
                      onFormChange('services', newServices)
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-200">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-200 block mb-3">
              Environment Variables
            </Label>
            <div className="space-y-2 mb-3">
              {Object.entries(formData.keys).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700"
                >
                  <div>
                    <p className="text-slate-300 font-mono text-sm">{key}</p>
                    <p className="text-slate-500 text-xs">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveKey(key)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={keyInput.key}
                onChange={(e) => onKeyInputChange(e.target.value, keyInput.value)}
                placeholder="Variable name"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <Input
                value={keyInput.value}
                onChange={(e) => onKeyInputChange(keyInput.key, e.target.value)}
                placeholder="Variable value"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <Button
                type="button"
                onClick={onAddKey}
                className="bg-slate-700 hover:bg-slate-600 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
