"use client"

import type { ProblemResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function ProblemTable({
  problems,
  onEdit,
  onDelete
}: {
  problems: ProblemResponse[]
  onEdit: (p: ProblemResponse) => void
  onDelete: (id: string) => void
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Title</th>
          <th>Framework</th>
          <th>Test Cases</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((p) => (
          <tr key={p.id}>
            <td>{p.title}</td>
            <td className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
