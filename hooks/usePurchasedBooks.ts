import { useSyncExternalStore } from "react"

const purchasedBookIds = new Set<string>()
const listeners = new Set<() => void>()

let version = 0

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return version
}

export function unlockBook(bookId: string) {
  if (!bookId || purchasedBookIds.has(bookId)) {
    return
  }

  purchasedBookIds.add(bookId)
  version += 1
  emitChange()
}

export function usePurchasedBook(bookId?: string) {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  if (!bookId) {
    return false
  }

  return purchasedBookIds.has(bookId)
}
