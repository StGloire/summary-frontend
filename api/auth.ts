import AsyncStorage from "@react-native-async-storage/async-storage"
import API_URL from "./client"

export async function register(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  return response.json()
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  const data = await response.json()

  if (data.token) {
    await AsyncStorage.setItem("token", data.token)
  }

  return data
}

export async function getToken() {
  return AsyncStorage.getItem("token")
}