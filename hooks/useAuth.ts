import { useState } from "react"
import { apiFetch } from "../services/api"
import { saveToken } from "../services/authStorage"

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)

    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })

    if (res.token) {
      await saveToken(res.token)
    }

    setLoading(false)
    return res
  }

  const register = async (email: string, password: string) => {
    setLoading(true)

    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })

    if (res.token) {
      await saveToken(res.token)
    }

    setLoading(false)
    return res
  }

  return { login, register, loading }
}