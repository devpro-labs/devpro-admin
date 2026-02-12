'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DeleteDialogProps {
  isOpen: boolean
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteDialog({
  isOpen,
  title = 'Delete Problem',
  description = 'Are you sure you want to delete this problem?',
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400 mt-2">{description}</CardDescription>
        </CardHeader>
        {itemName && (
          <CardContent className="pb-0">
            <div className="bg-red-900/20 border border-red-700 rounded p-3 mb-4">
              <p className="text-red-300 text-sm font-semibold">{itemName}</p>
            </div>
          </CardContent>
        )}
        <CardContent className="flex gap-3 justify-end pt-6">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
