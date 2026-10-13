import { useState, type FormEvent } from 'react'
import { normalize } from '../utils/matching'

interface IngredientPickerProps {
  selected: string[]
  onChange: (next: string[]) => void
  suggestions: string[]
  autocomplete: string[]
}

/** "Dolabımda ne var?" — malzemeleri çip (etiket) olarak seçtiren bileşen */
export default function IngredientPicker({ selected, onChange, suggestions, autocomplete }: IngredientPickerProps) {
  const [text, setText] = useState('')

  const add = (raw: string) => {
    // Virgülle birden fazla malzeme yazılabilir: "domates, biber, yumurta"
    const items = raw.split(',').map(normalize).filter(Boolean)
    const next = [...selected]
    for (const item of items) if (!next.includes(item)) next.push(item)
    onChange(next)
  }

  const remove = (item: string) => onChange(selected.filter((s) => s !== item))
  const toggle = (item: string) => (selected.includes(item) ? remove(item) : add(item))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    add(text)
    setText('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="input min-w-0 !rounded-full !py-3 !text-base"
          placeholder="Malzeme yaz… örn. domates"
          value={text}
          onChange={(e) => setText(e.target.value)}
          list="ingredient-options"
          aria-label="Malzeme ekle"
        />
        <datalist id="ingredient-options">
          {autocomplete.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <button type="submit" className="btn-primary shrink-0 !px-6">
          Ekle
        </button>
      </form>

      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-700">Elimde:</span>
          {selected.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => remove(item)}
              className="chip animate-pop-in border-olive-500 bg-olive-100 text-olive-600 hover:bg-olive-500 hover:text-white"
              aria-label={`${item} malzemesini kaldır`}
            >
              {item} <span aria-hidden>×</span>
            </button>
          ))}
          <button type="button" onClick={() => onChange([])} className="text-sm font-semibold text-ink-500 underline-offset-2 hover:underline">
            Temizle
          </button>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold tracking-wide text-ink-500 uppercase">Hızlı seç</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => {
            const active = selected.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={active}
                className={`chip ${
                  active
                    ? 'border-ink-900 bg-ink-900 text-cream-50'
                    : 'border-cream-200 bg-surface text-ink-700 hover:border-ink-500'
                }`}
              >
                {active ? '✓' : '+'} {item}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
