export async function validateSecretKey(key: string): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8082/api/problems", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
    return res.status !== 401
  } catch {
    return false
  }
}
