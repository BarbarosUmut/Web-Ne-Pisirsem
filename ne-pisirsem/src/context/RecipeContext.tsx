import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { Recipe, RecipeInput } from '../interfaces/Recipe'
import { SEED_RECIPES } from '../data/seedRecipes'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_KEY = 'ne-pisirsem:recipes'

const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

const buildSeed = (): Recipe[] => {
  const now = new Date().toISOString()
  return SEED_RECIPES.map((r) => ({ ...r, id: createId(), createdAt: now, updatedAt: now }))
}

interface RecipeContextValue {
  recipes: Recipe[]
  getRecipe: (id: string) => Recipe | undefined
  /** CREATE — yeni tarif ekler ve oluşan tarifi döndürür */
  addRecipe: (input: RecipeInput) => Recipe
  /** UPDATE — var olan tarifi günceller */
  updateRecipe: (id: string, input: RecipeInput) => void
  /** DELETE — tarifi siler */
  deleteRecipe: (id: string) => void
  toggleFavorite: (id: string) => void
  restoreSamples: () => void
}

const RecipeContext = createContext<RecipeContextValue | null>(null)

export function RecipeProvider({ children }: { children: ReactNode }) {
  // READ — tarifler LocalStorage'dan okunur; ilk açılışta örnek tarifler yüklenir
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(STORAGE_KEY, buildSeed)

  const getRecipe = useCallback((id: string) => recipes.find((r) => r.id === id), [recipes])

  const addRecipe = useCallback(
    (input: RecipeInput) => {
      const now = new Date().toISOString()
      const recipe: Recipe = { ...input, id: createId(), createdAt: now, updatedAt: now }
      setRecipes((prev) => [recipe, ...prev])
      return recipe
    },
    [setRecipes],
  )

  const updateRecipe = useCallback(
    (id: string, input: RecipeInput) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...input, updatedAt: new Date().toISOString() } : r)),
      )
    },
    [setRecipes],
  )

  const deleteRecipe = useCallback(
    (id: string) => setRecipes((prev) => prev.filter((r) => r.id !== id)),
    [setRecipes],
  )

  const toggleFavorite = useCallback(
    (id: string) =>
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))),
    [setRecipes],
  )

  const restoreSamples = useCallback(() => {
    setRecipes((prev) => {
      const existing = new Set(prev.map((r) => r.title.toLocaleLowerCase('tr-TR')))
      const missing = buildSeed().filter((r) => !existing.has(r.title.toLocaleLowerCase('tr-TR')))
      return [...prev, ...missing]
    })
  }, [setRecipes])

  const value = useMemo(
    () => ({ recipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, toggleFavorite, restoreSamples }),
    [recipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, toggleFavorite, restoreSamples],
  )

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

// Context ile birlikte hook dışa aktarılıyor (bilinçli tercih)
// oxlint-disable-next-line only-export-components
export function useRecipes() {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipes, RecipeProvider içinde kullanılmalı')
  return ctx
}
