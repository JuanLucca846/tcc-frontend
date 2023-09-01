import Head from "next/head";
import Image from 'next/image';
import styles from '../../styles/home.module.scss'

import logo from '../../public/logonossabiblioteca.svg';

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <>
    <Head>
      <title>NossaBiblioteca - Login</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logo} alt="Logo Biblioteca"/>

      <div className={styles.login}>
        <form>
          <Input
            placeholder="Digite seu email"
            type="text"
          />
          <Input
            placeholder="Digite sua senha"
            type="password"
          />

          <Button
          type="submit"
          loading={false}
          >
            Prosseguir
          </Button>

        </form>

        <a className={styles.text}>Crie uma conta</a>

      </div>
    </div>
    </>
  );
}
