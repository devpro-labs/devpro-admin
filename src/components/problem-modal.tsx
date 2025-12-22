"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Problem, TestCase, Framework, TestCaseType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Trash2 } from "lucide-react"

interface ProblemModalProps {
  problem: Problem | null
  onClose: () => void
  onSave: (problem: Problem) => void
}

export function ProblemModal({ problem, onClose, onSave }: ProblemModalProps) {
  const [title, setTitle] = useState("")
  const [statement, setStatement] = useState("")
  const [description, setDescription] = useState("")
  const [framework, setFramework] = useState<Framework>("express")
  const [testCases, setTestCases] = useState<TestCase[]>([])

  useEffect(() => {
    if (problem) {
      setTitle(problem.title)
      setStatement(problem.statement)
      setDescription(problem.description)
      setFramework(problem.framework)
      setTestCases(problem.testCases)
    } else {
      resetForm()
    }
  }, [problem])

  const resetForm = () => {
    setTitle("")
    setStatement("")
    setDescription("")
    setFramework("express")
    setTestCases([])
  }

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: "",
      expectedOutput: "",
      type: "sample",
    }
    setTestCases([...testCases, newTestCase])
  }

  const updateTestCase = (id: string, field: keyof TestCase, value: string | TestCaseType) => {
    setTestCases(testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)))
  }

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter((tc) => tc.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProblem: Problem = {
      id: problem?.id || Date.now().toString(),
      title,
      statement,
      description,
      framework,
      testCases,
      createdAt: problem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(newProblem)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">{problem ? "Edit Problem" : "Create New Problem"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Two Sum"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statement">Problem Statement</Label>
              <Textarea
                id="statement"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Brief problem statement..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed problem description with constraints and examples..."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <select
                id="framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value as Framework)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="express">Express (Node.js)</option>
                <option value="spring-boot">Spring Boot (Java)</option>
                <option value="fastapi">FastAPI (Python)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Test Cases</Label>
                <Button type="button" onClick={addTestCase} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </Button>
              </div>

              <div className="space-y-4">
                {testCases.map((tc, index) => (
                  <motion.div
                    key={tc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-border rounded-lg bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Test Case {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestCase(tc.id)}
                        className="hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`input-${tc.id}`}>Input</Label>
                      <Textarea
                        id={`input-${tc.id}`}
                        value={tc.input}
                        onChange={(e) => updateTestCase(tc.id, "input", e.target.value)}
                        placeholder="Test case input..."
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`output-${tc.id}`}>Expected Output</Label>
                      <Textarea
                        id={`output-${tc.id}`}
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(tc.id, "expectedOutput", e.target.value)}
                        placeholder="Expected output..."
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`type-${tc.id}`}>Test Case Type</Label>
                      <select
                        id={`type-${tc.id}`}
                        value={tc.type}
                        onChange={(e) => updateTestCase(tc.id, "type", e.target.value as TestCaseType)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="sample">Sample (Visible to users)</option>
                        <option value="hidden">Hidden (Used for validation)</option>
                      </select>
                    </div>
                  </motion.div>
                ))}

                {testCases.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No test cases added yet. Click "Add Test Case" to create one.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{problem ? "Update Problem" : "Create Problem"}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
