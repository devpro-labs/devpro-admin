export type Framework = "express" | "spring-boot" | "fastapi"

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
  statement: string
  description: string
  framework: Framework
  testCases: TestCase[]
  createdAt: string
  updatedAt: string
}
