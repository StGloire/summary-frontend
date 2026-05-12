// frontend/services/api.ts
import { ENV } from "../config/env"

export const API_URL = `http://${ENV.IP_ADDRESS}:${ENV.PORT}`

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {})
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Erreur API")
  }

  return data
}