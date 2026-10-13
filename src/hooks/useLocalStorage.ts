import { useEffect, useState } from 'react'

/**
 * useState gibi çalışır ama değeri tarayıcının LocalStorage'ında saklar.
 * Sayfa yenilense bile veriler kaybolmaz.
 */
export function useLocalStorage<T>(key: string, initialValue: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored) as T
    } catch {
      // Bozuk veri veya erişim engeli: varsayılan değere dön
    }
    return initialValue()
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Gizli sekme vb. durumlarda kaydetme başarısız olabilir — uygulama çalışmaya devam eder
    }
  }, [key, value])

  return [value, setValue] as const
}
