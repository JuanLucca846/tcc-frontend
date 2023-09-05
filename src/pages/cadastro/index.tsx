import Head from "next/head";
import Image from 'next/image';
import styles from '../../../styles/home.module.scss'

import logo from '../../../public/logonossabiblioteca.svg'

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import Link from "next/link";

export default function Cadastro() {
  return (
    <>
    <Head>
      <title>Cadastro</title>
    </Head>
    <div className={styles.containerCenter}>     
      <Image src={logo} alt="Logo Biblioteca"/>
      
      <div className={styles.login}>
        <h1>Criar uma conta</h1>

        <form>
          <Input
            placeholder="Digite seu nome"
            type="text"
          />
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

        <Link href="/" className={styles.text}>
        Já possuo conta
        </Link>
        

      </div>
    </div>
    </>
  );
}
