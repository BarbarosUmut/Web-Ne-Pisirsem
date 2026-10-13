import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecipeProvider } from './context/RecipeContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <RecipeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tarifler" element={<RecipesPage />} />
              <Route path="tarif/yeni" element={<RecipeFormPage />} />
              <Route path="tarif/:id" element={<RecipeDetailPage />} />
              <Route path="tarif/:id/duzenle" element={<RecipeFormPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </RecipeProvider>
  )
}
