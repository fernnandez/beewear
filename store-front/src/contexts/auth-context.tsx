import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { getProfileInfo } from "../services/auth.service";

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

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        setToken(token);

        try {
          const profileInfo = await getProfileInfo();
          setUser(profileInfo);
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    setIsAutenticated(true);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
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
