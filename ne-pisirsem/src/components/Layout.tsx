import { NavLink, Outlet, Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold sm:px-4 transition ${
    isActive ? 'bg-ink-900 text-cream-50' : 'text-ink-700 hover:bg-cream-100'
  }`

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-tomato-600 text-lg shadow-sm">🍲</span>
            <span className="hidden font-display text-xl font-bold tracking-tight min-[480px]:inline">Ne Pişirsem?</span>
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Öneri Al
            </NavLink>
            <NavLink to="/tarifler" className={navClass}>
              Tarifler
            </NavLink>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Açık temaya geç' : 'Karanlık temaya geç'}
              title={isDark ? 'Açık tema' : 'Karanlık tema'}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream-200 bg-surface text-base transition hover:border-ink-500"
            >
              <span key={theme} className="animate-pop-in" aria-hidden>
                {isDark ? '☀️' : '🌙'}
              </span>
            </button>
            <NavLink to="/tarif/yeni" className="btn-primary ml-1 !px-4 !py-2" aria-label="Tarif ekle">
              <span aria-hidden>＋</span>
              <span className="hidden sm:inline">Tarif Ekle</span>
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-cream-200 py-6 text-center text-sm text-ink-500">
        Ne Pişirsem? · Tarifleriniz tarayıcınızda (LocalStorage) saklanır · React + Tailwind CSS
      </footer>
    </div>
  )
}
