import { Route, Routes } from "react-router-dom";
import MainLayout from "../../components/Layout";
import { privateRoutes } from "./PrivateRoutes";

export default function PrivateRoutes() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<MainLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Routes>
  );
}