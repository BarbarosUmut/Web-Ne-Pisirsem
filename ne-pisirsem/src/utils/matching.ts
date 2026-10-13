import type { Ingredient, Recipe, RecipeMatch } from '../interfaces/Recipe'

/**
 * Hemen her evde bulunduğu varsayılan temel malzemeler.
 * "Temel malzemeler evde var" seçeneği açıkken eşleşme oranına dahil edilmez.
 */
export const PANTRY_STAPLES = [
  'tuz',
  'karabiber',
  'pul biber',
  'su',
  'sıvı yağ',
  'zeytinyağı',
  'şeker',
  'kimyon',
  'kekik',
  'nane',
  'tarçın',
]

/** Türkçe karakterlere uygun küçük harfe çevirir ve boşlukları sadeleştirir */
export const normalize = (text: string): string =>
  text.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim()

export const isStaple = (name: string): boolean => PANTRY_STAPLES.includes(normalize(name))

/**
 * Kullanıcının yazdığı malzeme ile tariftekini karşılaştırır.
 * "tavuk" → "tavuk göğsü", "mercimek" → "kırmızı mercimek" gibi eşleşmeleri yakalar,
 * ama "su" → "sucuk" gibi yanlış eşleşmeleri önlemek için kelime başına bakar.
 */
export const ingredientMatches = (userInput: string, recipeIngredient: string): boolean => {
  const a = normalize(userInput)
  const b = normalize(recipeIngredient)
  if (!a || !b) return false
  if (a === b) return true
  const recipeWords = b.split(' ')
  const userWords = a.split(' ')
  if (a.length >= 3 && recipeWords.some((w) => w.startsWith(a))) return true
  if (b.length >= 3 && userWords.some((w) => w.startsWith(b))) return true
  return false
}

/**
 * Elimdeki malzemelere göre tarifleri puanlar ve sıralar.
 * Sadece en az bir "temel olmayan" malzemesi eşleşen tarifler döner.
 */
export const findMatches = (
  recipes: Recipe[],
  pantry: string[],
  assumeStaples: boolean,
): RecipeMatch[] => {
  if (pantry.length === 0) return []

  const results: RecipeMatch[] = []

  for (const recipe of recipes) {
    const considered = recipe.ingredients.filter((ing) => !(assumeStaples && isStaple(ing.name)))
    const matched: Ingredient[] = []
    const missing: Ingredient[] = []

    for (const ing of considered) {
      if (pantry.some((p) => ingredientMatches(p, ing.name))) matched.push(ing)
      else missing.push(ing)
    }

    if (matched.length === 0) continue

    results.push({
      recipe,
      matched,
      missing,
      score: considered.length === 0 ? 1 : matched.length / considered.length,
    })
  }

  return results.sort(
    (x, y) =>
      y.score - x.score ||
      x.missing.length - y.missing.length ||
      x.recipe.durationMinutes - y.recipe.durationMinutes,
  )
}

/** Tüm tariflerde en sık geçen (temel olmayan) malzemeler — öneri çipleri için */
export const popularIngredients = (recipes: Recipe[], limit = 18): string[] => {
  const counts = new Map<string, number>()
  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const name = normalize(ing.name)
      if (!name || isStaple(name)) continue
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'))
    .slice(0, limit)
    .map(([name]) => name)
}

/** Tüm benzersiz malzeme adları — otomatik tamamlama için */
export const allIngredientNames = (recipes: Recipe[]): string[] =>
  [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => normalize(i.name))))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'tr'))
