import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import VerifyPage from "./pages/Verify";
import Categories from "./pages/Category";
import Product from "./pages/Product";

import "./App.css";

import MainLayout from "./components/Layout";
import ProtectedRoute from "./route/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* Verify */}
        <Route
          path="/verify"
          element={<VerifyPage />}
        />

        {/* Protected Pages */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/category"
            element={<Categories />}
          />

          <Route
            path="/product"
            element={<Product />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;