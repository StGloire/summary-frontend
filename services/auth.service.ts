// frontend/services/auth.service.ts

import { apiFetch } from "./api"

type AuthPayload = {
  email: string
  password: string
}

export async function register(payload: AuthPayload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

export async function login(payload: AuthPayload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}