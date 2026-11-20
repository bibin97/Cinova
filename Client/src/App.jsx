import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import ComingSoonPage from './pages/ComingSoonPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<ComingSoonPage title="Movies" />} />
        <Route path="series" element={<ComingSoonPage title="Series" />} />
        <Route path="genres" element={<ComingSoonPage title="Genres" />} />
        <Route path="trending" element={<ComingSoonPage title="Trending" />} />
        <Route path="login" element={<ComingSoonPage title="Login" />} />
        <Route path="signup" element={<ComingSoonPage title="Sign Up" />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
