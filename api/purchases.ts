import API_URL from "./client"
import { getToken } from "./auth"

export async function getPurchases() {
  const token = await getToken()

  const response = await fetch(`${API_URL}/purchases`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}