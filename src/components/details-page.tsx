import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Trash2 } from "lucide-react"
import { Problem } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface ProblemDetailPageProps {
  problem: Problem
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
}

const difficultyColors: Record<string, string> = {
  CASUAL: "bg-green-500/20 text-green-400",
  PRO: "bg-yellow-500/20 text-yellow-400",
  ENGINEER: "bg-red-500/20 text-red-400",
  PRO_MAX: "bg-red-800/20 text-red-400",
}

export function ProblemDetailPage({ problem, onEdit, onDelete, onBack }: ProblemDetailPageProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Back Button */}
      <Button onClick={onBack} variant="outline" className="gap-2 bg-transparent">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Header */}
      <Card className="p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-foreground">{problem.title}</h1>
              <Badge className={difficultyColors[problem?.difficulty]}>{problem.difficulty.toUpperCase()}</Badge>
              {!problem.isActive && <Badge variant="destructive">Inactive</Badge>}
            </div>
            <p className="text-muted-foreground">{problem.slug}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => {
                if (confirm("Delete this problem?")) {
                  onDelete()
                }
              }}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Framework</p>
          <p className="font-semibold text-foreground">{problem.framework}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Category</p>
          <p className="font-semibold text-foreground">{problem.category}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Test Cases</p>
          <p className="font-semibold text-foreground">{problem.testCases.length}</p>
        </Card>
      </div>

      {/* Configuration */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Image Name</p>
            <p className="font-mono text-sm text-foreground">{problem.imageName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Entry File</p>
            <p className="font-mono text-sm text-foreground">{problem.entryFile}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
            <p className="font-mono text-sm text-foreground">{problem.timeLimitSeconds}s</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
            <p className="font-mono text-sm text-foreground">{problem.memoryLimitMB}MB</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">CPU Limit</p>
            <p className="font-mono text-sm text-foreground">{problem.cpuLimit}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Services</p>
            <div className="flex flex-wrap gap-1">
              {problem.services.length > 0 ? (
                problem.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Statement */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Statement</h2>
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{problem.statement}</p>
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Description</h2>
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{problem.description}</p>
      </Card>

      {/* Test Cases */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Test Cases</h2>
        <div className="space-y-4">
          {problem.testCases.map((testCase, index) => (
            <div key={testCase.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="font-semibold text-foreground">Test Case {index + 1}</p>
                <Badge variant={testCase.type === "sample" ? "default" : "secondary"} className="text-xs">
                  {testCase.type.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Input</p>
                  <p className="font-mono text-sm bg-card p-2 rounded border border-border text-foreground">
                    {testCase.input}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected Output</p>
                  <p className="font-mono text-sm bg-card p-2 rounded border border-border text-foreground">
                    {testCase.expectedOutput}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Environment Variables */}
      {Object.keys(problem.keys).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(problem.keys).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <p className="font-mono text-sm text-muted-foreground">{key}</p>
                <p className="font-mono text-sm text-foreground truncate">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expected Frameworks */}
      {problem.expectedFrameworks.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Expected Frameworks</h2>
          <div className="flex flex-wrap gap-2">
            {problem.expectedFrameworks.map((fw) => (
              <Badge key={fw} variant="secondary">
                {fw}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  )
}