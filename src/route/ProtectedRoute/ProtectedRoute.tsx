import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return <Navigate to="/" replace />;
  }

  return children;
}