"use client"

import { motion } from "framer-motion"
import type { Problem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ProblemDetailsModalProps {
  problem: Problem
  onClose: () => void
}

const frameworkColors = {
  express: "bg-green-500/10 text-green-400 border-green-500/20",
  "spring-boot": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  fastapi: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
}

export function ProblemDetailsModal({ problem, onClose }: ProblemDetailsModalProps) {
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
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
            <Badge className={frameworkColors[problem.framework]}>{problem.framework}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Problem Statement</h3>
            <p className="text-muted-foreground leading-relaxed">{problem.statement}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Test Cases</h3>
            <div className="space-y-4">
              {problem.testCases.map((tc, index) => (
                <motion.div
                  key={tc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-foreground">Test Case {index + 1}</span>
                    <Badge variant={tc.type === "sample" ? "outline" : "secondary"} className="text-xs">
                      {tc.type === "sample" ? "Sample" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Input:</div>
                      <div className="p-2 bg-background rounded border border-border text-sm font-mono">{tc.input}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Expected Output:</div>
                      <div className="p-2 bg-background rounded border border-border text-sm font-mono">
                        {tc.expectedOutput}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">{new Date(problem.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 text-foreground">{new Date(problem.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
