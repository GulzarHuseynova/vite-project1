import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../../components/Layout";
import { privateRoutes } from "../PrivateRoute/PrivateRoutes";

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<MainLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}