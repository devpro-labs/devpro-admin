"use client"

import { Button } from "@/components/ui/button"
import { Problem } from "@/lib/types"
import { Pencil, Trash2 } from "lucide-react"

export function ProblemTable({
  problems,
  onEdit,
  onDelete,
  problemClickHandler,
}: {
  problems: Problem[]
  onEdit: (p: Problem) => void
  onDelete: (id: string) => void,
  problemClickHandler: () => void
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0e14] shadow-xl overflow-hidden">
      <table className="w-full text-sm text-gray-200">
        <thead className="bg-white/5 border-b border-white/10">
          <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Difficulty</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {problems.map((p, idx) => (
            <tr
              onClick={problemClickHandler}
              key={p.id}
              className="hover:bg-white/5 transition"
            >
              {/* Title */}
              <td className="px-6 py-4 font-medium text-white">
                {idx + 1}. {p.title}
              </td>

              {/* Difficulty */}
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                    p.difficulty === "CASUAL"
                      ? "bg-green-500/10 text-green-400 ring-green-500/30"
                      : p.difficulty === "PRO"
                      ? "bg-blue-500/10 text-blue-400 ring-blue-500/30"
                      : p.difficulty === "ENGINEER"
                      ? "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30"
                      : "bg-red-500/10 text-red-400 ring-red-500/30"
                  }`}
                >
                  {p.difficulty}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  {/* <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(p)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button> */}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(p.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {problems.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-12 text-gray-500">
                No problems found 🧠
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
