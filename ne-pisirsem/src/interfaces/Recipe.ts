// Uygulamadaki tüm veri tipleri burada tanımlanır.

export const CATEGORIES = [
  'Kahvaltı',
  'Çorba',
  'Ana Yemek',
  'Sebze Yemeği',
  'Makarna & Pilav',
  'Salata',
  'Atıştırmalık',
  'Tatlı',
] as const

export type Category = (typeof CATEGORIES)[number]

export const DIFFICULTIES = ['Kolay', 'Orta', 'Zor'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export interface Ingredient {
  /** Malzemenin adı, örn. "domates" — eşleştirme bu alana göre yapılır */
  name: string
  /** Miktar, örn. "2 adet" (opsiyonel) */
  amount: string
}

export interface Recipe {
  id: string
  title: string
  emoji: string
  category: Category
  durationMinutes: number
  servings: number
  difficulty: Difficulty
  ingredients: Ingredient[]
  steps: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

/** Form üzerinden gelen veri: id ve tarih alanları sistem tarafından eklenir */
export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>

/** Öneri motorunun her tarif için hesapladığı sonuç */
export interface RecipeMatch {
  recipe: Recipe
  /** 0–1 arası: tarifteki malzemelerin ne kadarı elde var */
  score: number
  matched: Ingredient[]
  missing: Ingredient[]
}
