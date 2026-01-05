"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProblemRequest, ProblemResponse } from "@/lib/types"
import { ProblemTable } from "@/components/table"
import { ProblemModal } from "@/components/problem-modal"
import { Search, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateSecretKey } from "@/lib/action"
import { LoginForm } from "@/components/login"
import {
  fetchProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "@/lib/api"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  const [problems, setProblems] = useState<ProblemResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingProblem, setEditingProblem] =
    useState<ProblemResponse | null>(null)

  /* -------------------- LOAD AUTH -------------------- */
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated")
    const key = sessionStorage.getItem("admin_api_key")

    if (auth === "true" && key) {
      setIsAuthenticated(true)
      setApiKey(key)
    }
  }, [])

  /* -------------------- LOAD PROBLEMS -------------------- */
  useEffect(() => {
    fetchProblems()
      .then(setProblems)
      .catch(() => alert("Failed to load problems"))
  }, [])

  /* -------------------- FILTER -------------------- */
  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problems

    const query = searchQuery.toLowerCase()

    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.difficulty?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query),
    )
  }, [problems, searchQuery])

  /* -------------------- AUTH -------------------- */
  const handleLogin = async (key: string) => {
    const isValid = await validateSecretKey(key)

    if (isValid) {
      setIsAuthenticated(true)
      setApiKey(key)
      setAuthError(null)
      sessionStorage.setItem("admin_authenticated", "true")
      sessionStorage.setItem("admin_api_key", key)
    } else {
      setAuthError("Invalid secret key")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setApiKey("")
    sessionStorage.clear()
  }

  /* -------------------- CRUD -------------------- */
  const handleCreate = () => {
    setEditingProblem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (problem: ProblemResponse) => {
    setEditingProblem(problem)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProblem(id, apiKey)
      setProblems((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert("Delete failed")
    }
  }

  const handleSave = async (req: ProblemRequest) => {
    try {
      if (editingProblem) {
        const updated = await updateProblem(
          editingProblem.id,
          req,
          apiKey,
        )
        setProblems((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        )
      } else {
        const created = await createProblem(req, apiKey)
        setProblems((prev) => [...prev, created])
      }
    } catch {
      alert("Save failed")
    } finally {
      setIsModalOpen(false)
      setEditingProblem(null)
    }
  }

  /* -------------------- LOGIN SCREEN -------------------- */
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={authError} />
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Problem Dashboard
              </h1>
              <p className="text-muted-foreground">
                Admin-only CRUD via Passkey
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreate} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create
              </Button>
              <Button onClick={handleLogout} variant="outline" size="lg">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
            <Input
              placeholder="Search by title / difficulty / category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <ProblemTable
            problems={filteredProblems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProblemModal
            problem={editingProblem}
            onSave={handleSave}
            onClose={() => {
              setIsModalOpen(false)
              setEditingProblem(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
