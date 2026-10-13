import { useState, type FormEvent } from 'react'
import { CATEGORIES, DIFFICULTIES, type Ingredient, type RecipeInput } from '../interfaces/Recipe'

const EMOJIS = ['🍲', '🥣', '🍳', '🍝', '🍚', '🍗', '🥩', '🐟', '🥗', '🥔', '🍆', '🫛', '🥟', '🌯', '🥪', '🍕', '🍮', '🍰', '🥛', '🍪']

interface RecipeFormProps {
  initial: RecipeInput
  submitLabel: string
  onSubmit: (data: RecipeInput) => void
  onCancel: () => void
}

type Errors = Partial<Record<'title' | 'ingredients' | 'steps' | 'durationMinutes' | 'servings', string>>

/** EKLE ve GÜNCELLE işlemlerinde ortak kullanılan form */
export default function RecipeForm({ initial, submitLabel, onSubmit, onCancel }: RecipeFormProps) {
  const [form, setForm] = useState<RecipeInput>(initial)
  const [errors, setErrors] = useState<Errors>({})

  const set = <K extends keyof RecipeInput>(key: K, value: RecipeInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // --- Malzeme satırları ---
  const updateIngredient = (index: number, patch: Partial<Ingredient>) =>
    set('ingredients', form.ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)))
  const addIngredient = () => set('ingredients', [...form.ingredients, { name: '', amount: '' }])
  const removeIngredient = (index: number) =>
    set('ingredients', form.ingredients.filter((_, i) => i !== index))

  // --- Adımlar ---
  const updateStep = (index: number, value: string) =>
    set('steps', form.steps.map((s, i) => (i === index ? value : s)))
  const addStep = () => set('steps', [...form.steps, ''])
  const removeStep = (index: number) => set('steps', form.steps.filter((_, i) => i !== index))

  const validate = (data: RecipeInput): Errors => {
    const e: Errors = {}
    if (data.title.trim().length < 2) e.title = 'Tarif adı en az 2 karakter olmalı.'
    if (!data.ingredients.length) e.ingredients = 'En az bir malzeme ekle.'
    if (!data.steps.length) e.steps = 'En az bir hazırlama adımı ekle.'
    if (!(data.durationMinutes > 0)) e.durationMinutes = 'Süre 0’dan büyük olmalı.'
    if (!(data.servings > 0)) e.servings = 'Porsiyon 0’dan büyük olmalı.'
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Boş satırları temizle
    const cleaned: RecipeInput = {
      ...form,
      title: form.title.trim(),
      ingredients: form.ingredients
        .map((i) => ({ name: i.name.trim(), amount: i.amount.trim() }))
        .filter((i) => i.name),
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
    }
    const found = validate(cleaned)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit(cleaned)
  }

  const errorText = (msg?: string) => msg && <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{msg}</p>

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Temel bilgiler */}
      <section className="card space-y-5 p-6">
        <h2 className="text-lg font-bold">Temel bilgiler</h2>

        <div>
          <label htmlFor="title" className="label">
            Tarif adı *
          </label>
          <input
            id="title"
            className="input"
            placeholder="örn. Annemin Mercimek Köftesi"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            aria-invalid={!!errors.title}
          />
          {errorText(errors.title)}
        </div>

        <div>
          <span className="label">Simge</span>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => set('emoji', em)}
                aria-pressed={form.emoji === em}
                aria-label={`Simge ${em}`}
                className={`grid h-10 w-10 place-items-center rounded-xl text-xl transition ${
                  form.emoji === em ? 'bg-tomato-600 shadow-sm ring-2 ring-tomato-600/30' : 'bg-cream-100 hover:bg-cream-200'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              Kategori
            </label>
            <select
              id="category"
              className="input"
              value={form.category}
              onChange={(e) => set('category', e.target.value as RecipeInput['category'])}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">Zorluk</span>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set('difficulty', d)}
                  aria-pressed={form.difficulty === d}
                  className={`chip flex-1 justify-center !py-2.5 ${
                    form.difficulty === d ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-cream-200 bg-surface text-ink-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="duration" className="label">
              Süre (dakika)
            </label>
            <input
              id="duration"
              type="number"
              min={1}
              className="input"
              value={form.durationMinutes || ''}
              onChange={(e) => set('durationMinutes', Number(e.target.value))}
            />
            {errorText(errors.durationMinutes)}
          </div>
          <div>
            <label htmlFor="servings" className="label">
              Kaç kişilik
            </label>
            <input
              id="servings"
              type="number"
              min={1}
              className="input"
              value={form.servings || ''}
              onChange={(e) => set('servings', Number(e.target.value))}
            />
            {errorText(errors.servings)}
          </div>
        </div>
      </section>

      {/* Malzemeler */}
      <section className="card p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold">Malzemeler *</h2>
          <span className="text-sm text-ink-500">{form.ingredients.length} satır</span>
        </div>
        <p className="mb-4 text-sm text-ink-500">
          Öneri motoru <b>malzeme adına</b> göre eşleştirir — adı sade yaz (örn. “domates”), miktarı yan kutuya.
        </p>
        <div className="space-y-2">
          {form.ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="input flex-[3]"
                placeholder="Malzeme adı"
                value={ing.name}
                onChange={(e) => updateIngredient(index, { name: e.target.value })}
                aria-label={`${index + 1}. malzeme adı`}
              />
              <input
                className="input flex-[2]"
                placeholder="Miktar (örn. 2 adet)"
                value={ing.amount}
                onChange={(e) => updateIngredient(index, { amount: e.target.value })}
                aria-label={`${index + 1}. malzeme miktarı`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn-ghost shrink-0 !px-3"
                aria-label={`${index + 1}. malzemeyi kaldır`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {errorText(errors.ingredients)}
        <button type="button" onClick={addIngredient} className="btn-secondary mt-3">
          ＋ Malzeme ekle
        </button>
      </section>

      {/* Adımlar */}
      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold">Hazırlanışı *</h2>
        <div className="space-y-3">
          {form.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <span className="mt-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tomato-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <textarea
                className="input min-h-[72px] resize-y"
                placeholder="Bu adımda ne yapılıyor?"
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                aria-label={`${index + 1}. adım`}
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="btn-ghost h-fit shrink-0 !px-3"
                aria-label={`${index + 1}. adımı kaldır`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {errorText(errors.steps)}
        <button type="button" onClick={addStep} className="btn-secondary mt-3">
          ＋ Adım ekle
        </button>
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Vazgeç
        </button>
        <button type="submit" className="btn-primary !px-8">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
