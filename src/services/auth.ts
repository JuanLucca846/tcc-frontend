import { destroyCookie } from 'nookies';
import Router from 'next/router';

let signOutCallback: () => void;

export function registerSignOutCallback(callback: () => void) {
    signOutCallback = callback;
}

export function signOut() {
    try {
        destroyCookie(undefined, "@nextauth.token");
        if (signOutCallback) {
            signOutCallback();
        }
        Router.push("/");
    } catch (error) {
        console.log("Erro", error);
    }
}
