import type { ProblemRequest, ProblemResponse } from "@/lib/types"

const BASE_URL = "http://localhost:8080/api/problems"

/* -------------------- GET (PUBLIC) -------------------- */
export async function fetchProblems(): Promise<ProblemResponse[]> {
  const res = await fetch(BASE_URL)

  if (!res.ok) {
    throw new Error("Failed to fetch problems")
  }

  return res.json()
}

/* -------------------- CREATE (ADMIN) -------------------- */
export async function createProblem(
  problem: ProblemRequest,
  apiKey: string,
): Promise<ProblemResponse> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(problem),
  })

  if (res.status === 403) {
    throw new Error("Forbidden")
  }

  if (!res.ok) {
    throw new Error("Create failed")
  }

  return res.json()
}

/* -------------------- UPDATE (ADMIN) -------------------- */
export async function updateProblem(
  id: string,
  problem: ProblemRequest,
  apiKey: string,
): Promise<ProblemResponse> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(problem),
  })

  if (res.status === 403) {
    throw new Error("Forbidden")
  }

  if (!res.ok) {
    throw new Error("Update failed")
  }

  return res.json()
}

/* -------------------- DELETE (ADMIN) -------------------- */
export async function deleteProblem(
  id: string,
  apiKey: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "X-API-KEY": apiKey,
    },
  })

  if (res.status === 403) {
    throw new Error("Forbidden")
  }

  if (!res.ok) {
    throw new Error("Delete failed")
  }
}
