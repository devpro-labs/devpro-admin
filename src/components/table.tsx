"use client"

import type { Problem } from "@/lib/types"
import { motion } from "framer-motion"
import { Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ProblemDetailsModal } from "./details-modal"

interface ProblemTableProps {
  problems: Problem[]
  onEdit: (problem: Problem) => void
  onDelete: (id: string) => void
}

const frameworkColors = {
  express: "bg-green-500/10 text-green-400 border-green-500/20",
  "spring-boot": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  fastapi: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
}

export function ProblemTable({ problems, onEdit, onDelete }: ProblemTableProps) {
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null)

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Title</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Framework</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Test Cases</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Updated</th>
                <th className="text-right py-4 px-6 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <motion.tr
                  key={problem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">{problem.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{problem.statement}</div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={frameworkColors[problem.framework]}>{problem.framework}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {problem.testCases.filter((tc) => tc.type === "sample").length} Sample
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {problem.testCases.filter((tc) => tc.type === "hidden").length} Hidden
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {new Date(problem.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingProblem(problem)}
                        className="hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(problem)}
                        className="hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(problem.id)}
                        className="hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingProblem && <ProblemDetailsModal problem={viewingProblem} onClose={() => setViewingProblem(null)} />}
    </>
  )
}
