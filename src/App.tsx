
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import VerifyPage from './pages/Verify';
import './App.css';
import MainLayout from "./components/Layout";
import ProtectedRoute from "./route/ProtectedRoute/ProtectedRoute";
import Categories from './pages/Category';

function App() {
  return (
    <Router>
      <Routes>
        {/* İlk açılan səhifə Login/Register olacaq */}
        <Route path="/" element={<LoginPage />} />

        {/* Register sonrası OTP doğrulama səhifəsi */}
        <Route path="/verify" element={<VerifyPage />} />
         <Route path='/category' element={<Categories/>}/>
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;