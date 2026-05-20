import './App.css'
import PrivateRoute from './route/PrivateRoute/PrivateRoute'
import PublicRoutes from './route/PublicRoute/PublicRoute'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken'))
  )

  return (
    <BrowserRouter>
      {isAuthenticated
        ? <PrivateRoute />
        : <PublicRoutes onLoginSuccess={() => setIsAuthenticated(true)} />
      }
    </BrowserRouter>
  )
}

export default App