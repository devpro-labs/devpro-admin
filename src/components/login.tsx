"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm({
  onLogin,
  error
}: {
  onLogin: (key: string) => void
  error?: string | null
}) {
  const [key, setKey] = useState("")

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <Input
          type="password"
          placeholder="Enter Secret Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button onClick={() => onLogin(key)} className="w-full">
          Login
        </Button>
      </div>
    </div>
  )
}
