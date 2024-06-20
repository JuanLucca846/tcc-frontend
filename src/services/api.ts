import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);
  //baseURL: "https://tcc-backend-joct.onrender.com",
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
    },
  });

  const getSignOut = () => {
    const { signOut } = useContext(AuthContext);
    return signOut;
  };

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        const signOut = getSignOut();
        if (typeof window !== undefined) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
