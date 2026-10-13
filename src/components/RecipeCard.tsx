import { Link } from 'react-router-dom'
import type { Recipe, RecipeMatch } from '../interfaces/Recipe'
import { useRecipes } from '../context/RecipeContext'

interface RecipeCardProps {
  recipe: Recipe
  /** Öneri sayfasında eşleşme bilgisi gösterilir */
  match?: RecipeMatch
  /** Liste sayfasında düzenle / sil butonları gösterilir */
  onDelete?: (recipe: Recipe) => void
}

export default function RecipeCard({ recipe, match, onDelete }: RecipeCardProps) {
  const { toggleFavorite } = useRecipes()
  const percent = match ? Math.round(match.score * 100) : null

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex items-start gap-4 p-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cream-100 text-3xl">
          {recipe.emoji || '🍽️'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-tomato-600 uppercase">{recipe.category}</p>
          <h3 className="line-clamp-2 text-lg leading-snug font-bold">
            <Link to={`/tarif/${recipe.id}`} className="after:absolute after:inset-0">
              {recipe.title}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-500">
            <span>⏱ {recipe.durationMinutes} dk</span>
            <span>👥 {recipe.servings} kişilik</span>
            <span>{recipe.difficulty}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(recipe.id)}
          aria-label={recipe.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          className="relative z-10 rounded-full p-1.5 text-xl transition hover:scale-110"
        >
          {recipe.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {match && percent !== null && (
        <div className="border-t border-cream-200 px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">
              {match.missing.length === 0 ? 'Her şey elinde! 🎉' : `${match.missing.length} malzeme eksik`}
            </span>
            <span className="font-bold text-olive-600">%{percent}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-olive-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          {match.missing.length > 0 && (
            <p className="mt-2 line-clamp-2 text-sm text-ink-500">
              Eksik: {match.missing.map((m) => m.name).join(', ')}
            </p>
          )}
        </div>
      )}

      {onDelete && (
        <div className="relative z-10 mt-auto flex gap-2 border-t border-cream-200 px-5 py-3">
          <Link to={`/tarif/${recipe.id}/duzenle`} className="btn-ghost !px-3 !py-1.5">
            ✏️ Düzenle
          </Link>
          <button type="button" onClick={() => onDelete(recipe)} className="btn-ghost !px-3 !py-1.5 text-red-600 hover:!bg-red-50 dark:text-red-400 dark:hover:!bg-red-500/15">
            🗑 Sil
          </button>
        </div>
      )}
    </article>
  )
}
