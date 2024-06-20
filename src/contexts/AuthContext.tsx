import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";
import { registerSignOutCallback, signOut as authSignOut } from "../services/auth";

type AuthContextData = {
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  token: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  courseId: number;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const isAuthenticated = !!user;
  const isAdmin = user?.admin || false;

  useEffect(() => {
    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/users")
        .then((response) => {
          const { id, name, email, admin } = response.data;
          setUser({ id, name, email, admin, token });
        })
        .catch(() => {
          signOut();
        });
    }

    registerSignOutCallback(() => setUser(null));
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      const userDetailsResponse = await api.get("/users");
      const { admin, email: userEmail } = userDetailsResponse.data;

      setUser({
        id,
        name,
        email: userEmail,
        admin,
        token,
      });

      toast.success("Sucesso");

      if (admin) {
        Router.push("/inicio");
      } else {
        Router.push("/minhaConta");
      }
    } catch (error) {
      toast.error("Email ou Senha incorreto");
      console.log("Erro", error);
    }
  }

  async function signUp({ name, email, password, courseId }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
        courseId,
      });

      toast.success("Registrado");

      Router.push("/");
    } catch (error) {
      toast.error("Erro");
      console.log("Erro", error);
    }
  }

  function signOut() {
    authSignOut();
  }

  return <AuthContext.Provider value={{ user, setUser, isAuthenticated, isAdmin, signIn, signOut, signUp }}>{children}</AuthContext.Provider>;
}
