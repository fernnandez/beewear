import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth-context";
import { AppShellLayout } from "../AppShell/AppShell";
import { Loading } from "../Loading/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !token) {
      navigate("/login");
    }
  }, [token, isLoading, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (!token) {
    return null;
  }

  return <AppShellLayout>{children}</AppShellLayout>;
}
