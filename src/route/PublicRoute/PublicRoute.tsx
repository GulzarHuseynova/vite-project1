import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../../pages/Login'
import VerifyPage from '../../pages/Verify'

interface Props {
  onLoginSuccess: () => void
}

export default function PublicRoutes({ onLoginSuccess }: Props) {
  return (
    <Routes>
      <Route path="/" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}