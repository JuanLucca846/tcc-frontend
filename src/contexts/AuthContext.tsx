import { createContext, ReactNode, useState, useEffect } from 'react';
import {destroyCookie, setCookie, parseCookies} from 'nookies'
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: number;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (error) {
        console.log('Erro')
    }
}

export function AuthProvider({ children }: AuthProviderProps ){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {
        
        const { '@nextauth.token': token } = parseCookies();

        if(token){
            api.get('/users').then(response => {
                const { id, name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })

            })
            .catch(() => {
                signOut();
            })
        }
        
    }, [])

     async function signIn({ email, password}: SignInProps){
        try {
            const response = await api.post('/login', {
                email,
                password
            })
            

            const { id, name, token } = response.data

            setCookie(undefined, "@nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                id,
                name,
                email,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Sucesso");
            Router.push('/biblioteca');

        } catch (error) {
            toast.error("Email ou Senha incorreto");
            console.log('Erro');
        }
    }

    async function signUp({name, email, password}: SignUpProps){
        try {
            
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success("Registrado");

            Router.push('/');

        } catch (error) {
            toast.error("Erro");
            console.log('Erro');
        }
    }

    return(
        <AuthContext.Provider value={{ user , isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}