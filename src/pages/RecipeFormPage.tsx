import { useNavigate, useParams, Link } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import { useToast } from '../context/ToastContext'
import type { RecipeInput } from '../interfaces/Recipe'
import RecipeForm from '../components/RecipeForm'
import { EMPTY_RECIPE } from '../data/emptyRecipe'
import EmptyState from '../components/EmptyState'

/**
 * /tarif/yeni          → EKLE
 * /tarif/:id/duzenle   → GÜNCELLE
 */
export default function RecipeFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { getRecipe, addRecipe, updateRecipe } = useRecipes()
  const toast = useToast()
  const navigate = useNavigate()

  const existing = id ? getRecipe(id) : undefined

  if (isEdit && !existing) {
    return (
      <EmptyState
        emoji="🍽️"
        title="Düzenlenecek tarif bulunamadı"
        action={<Link to="/tarifler" className="btn-primary">Tariflere dön</Link>}
      />
    )
  }

  // Düzenleme modunda formu mevcut tarifle doldur (id ve tarihleri hariç)
  const initial: RecipeInput = existing
    ? (({ id: _id, createdAt: _c, updatedAt: _u, ...rest }) => rest)(existing)
    : EMPTY_RECIPE

  const handleSubmit = (data: RecipeInput) => {
    if (existing) {
      updateRecipe(existing.id, data)
      toast('Tarif güncellendi ✓')
      navigate(`/tarif/${existing.id}`)
    } else {
      const created = addRecipe(data)
      toast('Yeni tarif eklendi 🎉')
      navigate(`/tarif/${created.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold sm:text-4xl">{isEdit ? 'Tarifi Düzenle' : 'Yeni Tarif Ekle'}</h1>
      <p className="mt-1 mb-6 text-ink-500">
        {isEdit ? 'Değişikliklerin kaydedildiğinde hemen öneri listesine yansır.' : 'Kendi tarifini ekle, öneri motoru onu da hesaba katsın.'}
      </p>
      <RecipeForm
        key={existing?.id ?? 'new'}
        initial={initial}
        submitLabel={isEdit ? 'Değişiklikleri Kaydet' : 'Tarifi Ekle'}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  )
}
