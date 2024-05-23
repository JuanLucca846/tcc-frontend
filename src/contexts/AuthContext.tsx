import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  admin: boolean;
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

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch (error) {
    console.log("Erro");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  const isAdmin = user?.admin || false;

  useEffect(() => {
    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/users")
        .then((response) => {
          const { id, name, cpf, email, admin } = response.data;

          setUser({
            id,
            name,
            cpf,
            email,
            admin,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { id, name, cpf, token, admin } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({
        id,
        name,
        cpf,
        email,
        admin,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Sucesso");
      Router.push("/inicio");
    } catch (error) {
      toast.error("Email ou Senha incorreto");
      console.log("Erro");
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
      console.log("Erro");
    }
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, signIn, signOut, signUp }}>{children}</AuthContext.Provider>;
}
