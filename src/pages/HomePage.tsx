import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CATEGORIES, type Category } from '../interfaces/Recipe'
import { allIngredientNames, findMatches, popularIngredients } from '../utils/matching'
import IngredientPicker from '../components/IngredientPicker'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'

const TIME_OPTIONS = [
  { label: 'Farketmez', value: 0 },
  { label: '≤ 20 dk', value: 20 },
  { label: '≤ 45 dk', value: 45 },
]

export default function HomePage() {
  const { recipes } = useRecipes()
  const navigate = useNavigate()

  const [pantry, setPantry] = useLocalStorage<string[]>('ne-pisirsem:pantry', () => [])
  const [assumeStaples, setAssumeStaples] = useLocalStorage('ne-pisirsem:staples', () => true)
  const [maxTime, setMaxTime] = useState(0)
  const [category, setCategory] = useState<Category | ''>('')

  // Süre ve kategori filtresinden geçen tarifler
  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) => (!maxTime || r.durationMinutes <= maxTime) && (!category || r.category === category),
      ),
    [recipes, maxTime, category],
  )

  const matches = useMemo(() => findMatches(filtered, pantry, assumeStaples), [filtered, pantry, assumeStaples])
  const suggestions = useMemo(() => popularIngredients(recipes), [recipes])
  const autocomplete = useMemo(() => allIngredientNames(recipes), [recipes])
  const quickIdeas = useMemo(
    () => [...filtered].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite) || a.durationMinutes - b.durationMinutes).slice(0, 6),
    [filtered],
  )

  const surprise = () => {
    // Malzeme seçildiyse eşleşenlerden, seçilmediyse filtrelenmiş tüm tariflerden rastgele seç
    const pool = matches.length ? matches.map((m) => m.recipe) : filtered
    if (!pool.length) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    navigate(`/tarif/${pick.id}`)
  }

  return (
    <div className="space-y-10">
      {/* Hero + malzeme seçici */}
      <section className="card relative overflow-hidden p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-6 text-[9rem] leading-none opacity-[0.08] select-none sm:text-[13rem]">
          🥘
        </div>
        <p className="mb-2 text-sm font-semibold tracking-wide text-tomato-600 uppercase">Evde yemek fikri</p>
        <h1 className="max-w-2xl text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
          Dolabında ne var? <span className="text-tomato-600">Gerisini bize bırak.</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink-700">
          Elindeki malzemeleri seç, sana en az eksikle yapabileceğin tarifleri sıralayalım.
        </p>

        <div className="mt-8 max-w-3xl">
          <IngredientPicker selected={pantry} onChange={setPantry} suggestions={suggestions} autocomplete={autocomplete} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream-200 pt-5 text-sm">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-ink-700">
            <input
              type="checkbox"
              checked={assumeStaples}
              onChange={(e) => setAssumeStaples(e.target.checked)}
              className="h-4 w-4 accent-olive-600"
            />
            Tuz, yağ, şeker ve baharatlar evde var say
          </label>

          <div className="flex items-center gap-1" role="group" aria-label="Süre filtresi">
            {TIME_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setMaxTime(o.value)}
                aria-pressed={maxTime === o.value}
                className={`chip ${maxTime === o.value ? 'border-tomato-600 bg-tomato-600 text-white' : 'border-cream-200 bg-surface text-ink-700'}`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | '')}
            className="input !w-auto !rounded-full !py-1.5"
            aria-label="Kategori filtresi"
          >
            <option value="">Tüm kategoriler</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button type="button" onClick={surprise} className="btn-secondary ml-auto">
            🎲 Bana sürpriz yap
          </button>
        </div>
      </section>

      {/* Sonuçlar */}
      {pantry.length > 0 ? (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Senin için öneriler</h2>
              <p className="text-sm text-ink-500">
                {matches.length
                  ? `${matches.length} tarif bulundu — en az eksiği olan en üstte.`
                  : 'Bu malzemelerle eşleşen tarif yok.'}
              </p>
            </div>
          </div>
          {matches.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((m) => (
                <RecipeCard key={m.recipe.id} recipe={m.recipe} match={m} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🤔"
              title="Eşleşen tarif bulunamadı"
              description="Birkaç malzeme daha eklemeyi, filtreleri gevşetmeyi ya da kendi tarifini eklemeyi dene."
              action={
                <Link to="/tarif/yeni" className="btn-primary">
                  ＋ Yeni tarif ekle
                </Link>
              }
            />
          )}
        </section>
      ) : (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Hızlı fikirler</h2>
              <p className="text-sm text-ink-500">Favorilerin ve en çabuk hazırlananlar.</p>
            </div>
            <Link to="/tarifler" className="text-sm font-semibold text-tomato-600 hover:underline">
              Tüm tarifler →
            </Link>
          </div>
          {quickIdeas.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickIdeas.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          ) : (
            <EmptyState emoji="📭" title="Bu filtrede tarif yok" description="Süre veya kategori filtresini değiştir." />
          )}
        </section>
      )}
    </div>
  )
}
