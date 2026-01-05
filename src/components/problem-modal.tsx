// ProblemModal.tsx
"use client"

import { useState, useEffect } from "react"
import type { ProblemRequest, ProblemResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Add `problem` to the props
export function ProblemModal({
  problem,
  onSave,
  onClose,
}: {
  problem: ProblemResponse | null
  onSave: (p: ProblemRequest) => void
  onClose: () => void
}) {
  // Map backend response to form fields
  const [title, setTitle] = useState(problem?.title || "")
  const [description, setDescription] = useState("") // if your backend does not send description, keep empty
  const [difficulty, setDifficulty] = useState(problem?.difficulty || "")
  const [category, setCategory] = useState(problem?.category || "")

  useEffect(() => {
    if (problem) {
      setTitle(problem.title)
      setDifficulty(problem.difficulty || "")
      setCategory(problem.category || "")
      setDescription("") // or map if available
    } else {
      setTitle("")
      setDifficulty("")
      setCategory("")
      setDescription("")
    }
  }, [problem])

  const save = () => {
    const payload: ProblemRequest = {
      title,
      description,
      difficulty,
      tags: [],
      entryFile: "",
      services: [],
      testCases: [],
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 w-96 space-y-3">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input placeholder="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

        <div className="flex gap-2">
          <Button onClick={save}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
