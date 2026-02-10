'use client';

import { Plus, LogOut, Search } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"
import { useRouter } from "next/navigation"
import { ProblemTable } from "./table"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Problem } from "@/lib/types"

interface DashboardProps {
  handleLogout: () => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  filteredProblems: Problem[]
  handleEdit: (p: Problem) => void
  handleDelete: (id: string) => void
  problemClickHandler: () => void
  handleCreate: () => void
}

const Dashboard = ({
  handleLogout,
  searchQuery,
  setSearchQuery,
  filteredProblems,
  handleEdit,
  handleDelete,
  problemClickHandler,
  handleCreate
}: DashboardProps) => {
  const router = useRouter()

  const handleCreateProblem = () => {
    router.push("/create-problem")
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Problem Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Admin-only CRUD via Passkey
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by title / difficulty / category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-[#0b0e14] border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Table */}
        <ProblemTable
          problems={filteredProblems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          problemClickHandler={problemClickHandler}
        />
      </motion.div>
    </div>
  )
}

export default Dashboard
