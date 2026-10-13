import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function RecipeDetailPage() {
  const { id = '' } = useParams()
  const { getRecipe, deleteRecipe, toggleFavorite } = useRecipes()
  const toast = useToast()
  const navigate = useNavigate()
  const recipe = getRecipe(id)

  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!recipe) {
    return (
      <EmptyState
        emoji="🍽️"
        title="Tarif bulunamadı"
        description="Bu tarif silinmiş ya da hiç var olmamış olabilir."
        action={<Link to="/tarifler" className="btn-primary">Tariflere dön</Link>}
      />
    )
  }

  const toggleChecked = (index: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  const handleDelete = () => {
    deleteRecipe(recipe.id)
    toast(`“${recipe.title}” silindi`, 'danger')
    navigate('/tarifler')
  }

  return (
    <article className="mx-auto max-w-4xl">
      <Link to="/tarifler" className="mb-4 inline-block text-sm font-semibold text-ink-500 hover:text-ink-900">
        ← Tüm tarifler
      </Link>

      <header className="card mb-6 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-cream-100 text-6xl">{recipe.emoji}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold tracking-wide text-tomato-600 uppercase">{recipe.category}</p>
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{recipe.title}</h1>
          <dl className="mt-3 flex flex-wrap gap-2 text-sm">
            {[
              ['⏱', `${recipe.durationMinutes} dk`],
              ['👥', `${recipe.servings} kişilik`],
              ['📊', recipe.difficulty],
              ['🧂', `${recipe.ingredients.length} malzeme`],
            ].map(([icon, text]) => (
              <div key={text} className="rounded-full bg-cream-100 px-3 py-1 font-medium text-ink-700">
                <dt className="sr-only">{icon}</dt>
                <dd>
                  {icon} {text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <button type="button" className="btn-secondary" onClick={() => toggleFavorite(recipe.id)}>
            {recipe.isFavorite ? '❤️ Favoride' : '🤍 Favorile'}
          </button>
          <Link to={`/tarif/${recipe.id}/duzenle`} className="btn-secondary">
            ✏️ Düzenle
          </Link>
          <button type="button" className="btn-ghost text-red-600 hover:!bg-red-50 dark:text-red-400 dark:hover:!bg-red-500/15" onClick={() => setConfirmOpen(true)}>
            🗑 Sil
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <section className="card h-fit p-6">
          <h2 className="mb-1 text-xl font-bold">Malzemeler</h2>
          <p className="mb-4 text-xs text-ink-500">Hazırladıklarını işaretle</p>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-cream-50">
                  <input
                    type="checkbox"
                    checked={checked.has(index)}
                    onChange={() => toggleChecked(index)}
                    className="mt-1 h-4 w-4 accent-olive-600"
                  />
                  <span className={checked.has(index) ? 'text-ink-500 line-through' : ''}>
                    <span className="font-semibold capitalize">{ing.name}</span>
                    {ing.amount && <span className="text-ink-500"> — {ing.amount}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-xl font-bold">Hazırlanışı</h2>
          <ol className="space-y-5">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tomato-600 font-display text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 leading-relaxed text-ink-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <p className="mt-6 text-center text-xs text-ink-500">
        Son güncelleme: {new Date(recipe.updatedAt).toLocaleString('tr-TR')}
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title="Tarif silinsin mi?"
        message={`“${recipe.title}” tarifi kalıcı olarak silinecek.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  )
}
