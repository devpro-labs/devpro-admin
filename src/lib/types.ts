export type Framework = "express" | "fastapi"

export type ServiceType = "REDIS" | "KAFKA" | "DB"

export type TestCaseType = "sample" | "hidden"

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  type: TestCaseType
}

export interface Problem {
  id: string
  title: string
  slug: string
  statement: string
  description: string
  difficulty: string
  category: string
  framework: Framework
  imageName: string
  entryFile: string
  services: ServiceType[]
  keys: Record<string, string>
  timeLimitSeconds: number
  memoryLimitMB: number
  cpuLimit: number
  expectedFrameworks: Framework[]
  testCases: TestCase[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
