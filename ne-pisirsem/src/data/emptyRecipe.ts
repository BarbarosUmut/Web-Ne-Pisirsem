import type { RecipeInput } from '../interfaces/Recipe'

/** Yeni tarif formunun başlangıç değerleri */
export const EMPTY_RECIPE: RecipeInput = {
  title: '',
  emoji: '🍲',
  category: 'Ana Yemek',
  durationMinutes: 30,
  servings: 2,
  difficulty: 'Kolay',
  ingredients: [{ name: '', amount: '' }],
  steps: [''],
  isFavorite: false,
}
