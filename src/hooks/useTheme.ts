import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ne-pisirsem:theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

const readStored = (): Theme | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/**
 * Açık / karanlık tema yönetimi.
 * - Kullanıcı seçim yapmadıysa işletim sisteminin tercihini izler.
 * - Seçim yapıldıysa LocalStorage'a kaydedilir ve sonraki ziyarette hatırlanır.
 * - <html> etiketine "dark" sınıfını ekler/çıkarır (Tailwind dark: varyantı buna bakar).
 */
export function useTheme() {
  const [stored, setStored] = useState<Theme | null>(readStored)
  const [systemDark, setSystemDark] = useState(() => media().matches)

  // Sistem teması değişirse (örn. akşam otomatik koyu mod) anında uyum sağla
  useEffect(() => {
    const mq = media()
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme: Theme = stored ?? (systemDark ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#18120e' : '#fffbf5')
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setStored(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // kaydedilemese de tema bu oturumda değişir
    }
  }, [theme])

  return { theme, toggleTheme }
}
