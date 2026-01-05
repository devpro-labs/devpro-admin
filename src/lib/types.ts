/* ---------- ENUMS ---------- */
export type Framework = "express" | "spring-boot" | "fastapi"

export type TestCaseType = "sample" | "hidden"

/* ---------- TEST CASE ---------- */
export interface TestCase {
  id?: string
  input: string
  expectedOutput: string
  type: TestCaseType
}

/* ---------- CREATE / UPDATE REQUEST ---------- */
export interface ProblemRequest {
  title: string
  description: string
  difficulty: string
  tags: string[]
  entryFile: string 
  services: string[]          // maps to List<ServiceType>
  timeLimitSeconds?: number
  memoryLimitMB?: number
  cpuLimit?: number
  testCases: TestCase[]
}

/* ---------- RESPONSE FROM BACKEND ---------- */
export interface ProblemResponse {
  id: string          // UUID as string
  title: string
  slug: string
  difficulty: string
  category: string
  isActive: boolean
}
