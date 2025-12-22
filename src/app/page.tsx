"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Problem } from "@/lib/types"
import { mockProblems } from "@/data/problems"
import { ProblemTable } from "@/components/table"
import { ProblemModal } from "@/components/problem-modal"
import { Search, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateSecretKey } from "@/lib/action"
import { LoginForm } from "@/components/login"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [problems, setProblems] = useState<Problem[]>(mockProblems)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)

  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problems

    const query = searchQuery.toLowerCase()
    return problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(query) ||
        problem.statement.toLowerCase().includes(query) ||
        problem.framework.toLowerCase().includes(query),
    )
  }, [problems, searchQuery])

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (key: string) => {
    const isValid = await validateSecretKey(key)

    if (isValid) {
      setIsAuthenticated(true)
      setAuthError(null)
      sessionStorage.setItem("admin_authenticated", "true")
    } else {
      setAuthError("Invalid secret key. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
  }

  const handleCreate = () => {
    setEditingProblem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setProblems(problems.filter((p) => p.id !== id))
  }

  const handleSave = (problem: Problem) => {
    if (editingProblem) {
      setProblems(problems.map((p) => (p.id === problem.id ? { ...problem, updatedAt: new Date().toISOString() } : p)))
    } else {
      setProblems([...problems, { ...problem, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
    setEditingProblem(null)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={authError} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Problem Dashboard</h1>
              <p className="text-muted-foreground">Manage coding problems and test cases</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Problem
              </Button>
              <Button onClick={handleLogout} size="lg" variant="outline" className="gap-2 bg-transparent">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search problems by title, statement, or framework..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProblemTable problems={filteredProblems} onEdit={handleEdit} onDelete={handleDelete} />
          </motion.div>

          {filteredProblems.length === 0 && searchQuery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground text-lg">No problems found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProblemModal
            problem={editingProblem}
            onClose={() => {
              setIsModalOpen(false)
              setEditingProblem(null)
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}