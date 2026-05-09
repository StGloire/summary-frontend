import { useEffect, useState } from "react"
import { getPurchases } from "../api/purchases"

export function usePurchases() {
  const [purchases, setPurchases] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [])

  async function loadPurchases() {
    try {
      const data = await getPurchases()

      const ids = data.map((item: any) => item.book_id)

      setPurchases(ids)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    purchases,
    loading,
    reload: loadPurchases
  }
}