export type Framework = "express" | "fastapi"

export type ServiceType = "REDIS" | "POSTGRES" | "MONGODB" | "AUTH" | "REST"

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type TestCaseType = "sample" | "hidden"

export interface TestCase {
  id?: string
  problemId?: string
  method: HTTPMethod
  endpoint: string
  input: Record<string, unknown>
  expectedOutput: Record<string, unknown>
  expectedStatus: number
  isHidden: boolean
}

export interface TestCaseRequest {
  method: HTTPMethod
  endpoint: string
  input: Record<string, unknown>
  expectedOutput: Record<string, unknown>
  expectedStatus: number
  isHidden: boolean
}

export interface Problem {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  category: string
  imageName: Record<string, string>
  entryFile: string
  services: ServiceType[]
  keys: Record<string, string>
  timeLimitSeconds: number
  memoryLimitMB: number
  cpuLimit: number
  composeFile?: Record<string, string>
  testCases: TestCase[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProblemRequest {
  title: string
  description: string
  difficulty: string
  tags: string[]
  imageName: Record<string, string>
  entryFile: string
  services: ServiceType[]
  keys: Record<string, string>
  timeLimitSeconds: number
  memoryLimitMB: number
  cpuLimit: number
  composeFile?: Record<string, string>
  testCases: TestCaseRequest[]
}
