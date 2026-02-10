"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Problem } from "@/lib/types"
import { ProblemDetailPage } from "@/components/details-page"
import Dashboard from "@/components/dashboard"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  const [problems, setProblems] = useState<Problem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState<"list" | "detail">("list")
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)

  const router = useRouter();

  const [editingProblem, setEditingProblem] =
    useState<Problem | null>(null)

  const handleCreate = () => {
    setEditingProblem(null)
    setIsModalOpen(true)
  }

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
    if (isAuthenticated)
      fetchProblems()
        .then(setProblems)
        .catch(() => alert("Failed to load problems"))
  }, [isAuthenticated])
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
  const handleEdit = (problem: Problem) => {
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

  const handleSave = async (req: Problem) => {
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
    <div className="min-h-screen bg-[#05060a]">
      <AnimatePresence mode="wait">
        {currentPage === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Dashboard
              handleLogout={handleLogout}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProblems={filteredProblems}
              handleEdit={(p) => {
                setEditingProblem(p)
                setIsModalOpen(true)
              }}
              handleDelete={handleDelete}
              problemClickHandler={
                () => {
                  setCurrentPage("detail");
                }
              }
            />

            {/* Clicking a row should open detail */}
            
          </motion.div>
        )}

        {currentPage === "detail" && selectedProblem && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto p-8"
          >
            <ProblemDetailPage
              problem={selectedProblem}
              onBack={() => setCurrentPage("list")}
              onEdit={() => {
                setEditingProblem(selectedProblem)
                setIsModalOpen(true)
              }}
              onDelete={() => {
                handleDelete(selectedProblem.id)
                setCurrentPage("list")
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
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
