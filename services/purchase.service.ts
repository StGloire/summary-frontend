// frontend/services/purchase.service.ts

import { apiFetch } from "./api"

export async function getPurchases(token: string) {
  return apiFetch("/purchases", {}, token)
}