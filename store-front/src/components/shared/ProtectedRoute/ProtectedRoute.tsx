import type React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/auth-context";
import { Loading } from "../Loading/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();
  const hasAttemptedRedirect = useRef(false);

  useEffect(() => {
    console.log("🔄 ProtectedRoute - Estado atual:", {
      isLoading,
      hasToken: !!token,
      token: token ? "presente" : "ausente",
      hasAttemptedRedirect: hasAttemptedRedirect.current
    });

    // SÓ redirecionar se:
    // 1. Não estiver carregando
    // 2. Não tiver token
    // 3. Ainda não tentou redirecionar (evita loops)
    if (!isLoading && !token && !hasAttemptedRedirect.current) {
      console.log("❌ Redirecionando para / - Sem token válido");
      hasAttemptedRedirect.current = true;
      navigate("/");
    }
  }, [token, isLoading, navigate]);

  // Mostrar loading enquanto carrega
  if (isLoading) {
    console.log("⏳ ProtectedRoute - Mostrando loading");
    return <Loading />;
  }

  // Se chegou aqui e não tem token, não renderizar nada
  if (!token) {
    console.log("🚫 ProtectedRoute - Sem token, não renderizando");
    return null;
  }

  // Token válido, renderizar children
  console.log("✅ ProtectedRoute - Token válido, renderizando children");
  return <>{children}</>;
}