import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { getProfileInfo } from "../services/auth.service";

// Funções utilitárias para cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface AuthContextType {
  user: any;
  setUser: (data: any) => void;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  isAutenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAutenticated, setIsAutenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Inicialização do auth na primeira carga
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie("beewear-auth-token");

      if (token) {
        setToken(token);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Carregar perfil quando o token mudar
  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          const profileInfo = await getProfileInfo();
          setUser(profileInfo);
          setIsAutenticated(true);
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          // Limpar dados inválidos
          setToken(null);
          deleteCookie("beewear-auth-token");
          setIsAutenticated(false);
        }
      } else {
        setUser(null);
        setIsAutenticated(false);
      }
    };

    if (!isLoading) {
      loadProfile();
    }
  }, [token, isLoading]);

  const login = (token: string) => {
    setToken(token);
    setCookie("beewear-auth-token", token, 30); // 30 dias
    setIsAutenticated(true);
  };

  const logout = () => {
    setToken(null);
    deleteCookie("beewear-auth-token");
    setIsAutenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isLoading, setUser, user, isAutenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
