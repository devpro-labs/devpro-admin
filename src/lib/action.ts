"use server"

export async function validateSecretKey(key: string): Promise<boolean> {
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY

  if (!ADMIN_SECRET_KEY) {
    console.error("[v0] ADMIN_SECRET_KEY environment variable is not set")
    return false
  }

  return key === ADMIN_SECRET_KEY
}
