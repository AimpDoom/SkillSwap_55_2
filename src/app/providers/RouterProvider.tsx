import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import { Footer } from '@/components/widgets/Footer'
import { Header } from '@/components/widgets/Header'
import { ROUTES } from '@/shared/lib/constants'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const AllSkillsPage = lazy(() => import('@/pages/AllSkillsPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/ErrorPages/NotFoundPage'))
const ServerErrorPage = lazy(() => import('@/pages/ErrorPages/Error500Page'))

function AppContent() {
  const location = useLocation()

  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER

  return (
    <>
      {!isAuthPage && <Header />}

      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<CatalogPage />} />
          <Route path={ROUTES.SKILLS} element={<AllSkillsPage />} />
          <Route path={ROUTES.SKILL} element={<SkillPage />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />

          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Защищённые маршруты — добавить PrivateRoute обёртку */}
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />

          <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {!isAuthPage && <Footer />}
    </>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
