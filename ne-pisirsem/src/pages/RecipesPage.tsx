import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import { useToast } from '../context/ToastContext'
import { CATEGORIES, type Category, type Recipe } from '../interfaces/Recipe'
import { normalize } from '../utils/matching'
import RecipeCard from '../components/RecipeCard'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

type SortKey = 'newest' | 'duration' | 'title'

/** LİSTELEME sayfası — arama, filtreleme, sıralama ve silme */
export default function RecipesPage() {
  const { recipes, deleteRecipe, restoreSamples } = useRecipes()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [sort, setSort] = useState<SortKey>('newest')
  const [toDelete, setToDelete] = useState<Recipe | null>(null)

  const visible = useMemo(() => {
    const q = normalize(query)
    const list = recipes.filter((r) => {
      if (category && r.category !== category) return false
      if (onlyFavorites && !r.isFavorite) return false
      if (!q) return true
      return normalize(r.title).includes(q) || r.ingredients.some((i) => normalize(i.name).includes(q))
    })
    return list.sort((a, b) => {
      if (sort === 'duration') return a.durationMinutes - b.durationMinutes
      if (sort === 'title') return a.title.localeCompare(b.title, 'tr')
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [recipes, query, category, onlyFavorites, sort])

  const confirmDelete = () => {
    if (!toDelete) return
    deleteRecipe(toDelete.id)
    toast(`“${toDelete.title}” silindi`, 'danger')
    setToDelete(null)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Tarif Defteri</h1>
          <p className="text-ink-500">Toplam {recipes.length} tarif · {recipes.filter((r) => r.isFavorite).length} favori</p>
        </div>
        <Link to="/tarif/yeni" className="btn-primary">
          ＋ Yeni Tarif
        </Link>
      </div>

      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
        <input
          type="search"
          className="input"
          placeholder="🔍 Tarif adı veya malzeme ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Tariflerde ara"
        />
        <select className="input sm:!w-44" value={category} onChange={(e) => setCategory(e.target.value as Category | '')} aria-label="Kategori">
          <option value="">Tüm kategoriler</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input sm:!w-40" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sıralama">
          <option value="newest">En yeni</option>
          <option value="duration">En kısa süre</option>
          <option value="title">A → Z</option>
        </select>
        <button
          type="button"
          onClick={() => setOnlyFavorites((v) => !v)}
          aria-pressed={onlyFavorites}
          className={`chip justify-center !py-2.5 ${onlyFavorites ? 'border-tomato-600 bg-tomato-600 text-white' : 'border-cream-200 bg-surface text-ink-700'}`}
        >
          {onlyFavorites ? '❤️' : '🤍'} Favoriler
        </button>
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          emoji="📖"
          title="Tarif defterin boş"
          description="İlk tarifini ekle ya da örnek tarifleri geri yükle."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/tarif/yeni" className="btn-primary">
                ＋ Tarif ekle
              </Link>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  restoreSamples()
                  toast('Örnek tarifler yüklendi', 'info')
                }}
              >
                Örnek tarifleri yükle
              </button>
            </div>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState emoji="🔍" title="Sonuç bulunamadı" description="Aramanı veya filtreleri değiştirmeyi dene." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDelete={setToDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Tarif silinsin mi?"
        message={`“${toDelete?.title ?? ''}” tarifi kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
