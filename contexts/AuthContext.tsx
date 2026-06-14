// frontend/contexts/AuthContext.tsx

import {
  createContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

import { login, register, getCurrentUser } from "../services/auth.service"
import { getPurchases } from "../services/purchase.service"
import { apiFetch } from "../services/api" // ✅ Ajouté

import {
  saveToken,
  getToken,
  removeToken
} from "../storage/authStorage"

 
type User = {
  id: number
  email: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  purchases: string[]
  loading: boolean
  isAuthenticated: boolean

  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  purchaseBook: (bookId: string) => Promise<void> // ✅ Déjà présent
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
)

export function AuthProvider({
  children
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const isAuthenticated = !!user

  useEffect(() => {
    restoreSession()
  }, [])

  async function restoreSession() {
    try {
        const savedToken = await getToken()

        if (!savedToken) {
        setLoading(false)
        return
        }

        setToken(savedToken)

        // ✅ récupérer user réel
        const currentUser = await getCurrentUser(savedToken)

        setUser(currentUser)

        // ✅ récupérer achats
        const purchaseData = await getPurchases(savedToken)

        setPurchases(
        purchaseData.map((item: any) => item.book_id)
        )
    } catch (error) {
        console.log(error)

        await removeToken()

        setUser(null)
        setToken(null)
        setPurchases([])
    } finally {
        setLoading(false)
    }
    }

  async function signIn(email: string, password: string) {
    const data = await login({
      email,
      password
    })

    setUser(data.user)
    setToken(data.token)
    await saveToken(data.token)

    const purchaseData = await getPurchases(data.token)
    setPurchases(
      purchaseData.map((item: any) => item.book_id)
    )
  }

  async function signUp(email: string, password: string) {
    const data = await register({
      email,
      password
    })

    setUser(data.user)
    setToken(data.token)
    await saveToken(data.token)
  }

  async function logout() {
    setUser(null)
    setToken(null)
    setPurchases([])
    await removeToken()
  }

  // ✅ AJOUT DE purchaseBook
  const purchaseBook = async (bookId: string) => {
    if (!token) {
      console.error("Aucun token, utilisateur non connecté")
      return
    }

    try {
      await apiFetch(
        "/purchases",
        {
          method: "POST",
          body: JSON.stringify({ bookId })
        },
        token
      )

      // ✅ Ajoute le bookId aux achats localement
      setPurchases((prev) =>
        prev.includes(bookId)
            ? prev
            : [...prev, bookId]
        )
    } catch (error) {
      console.error("Erreur lors de l'achat :", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        purchases,
        loading,
        isAuthenticated,
        signIn,
        signUp,
        logout,
        purchaseBook // ✅ EXPOSÉ ICI
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}