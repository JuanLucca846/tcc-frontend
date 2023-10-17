import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/home.module.scss";
import logo from "../../public/logonossabiblioteca.svg";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.error("Preencha os dados corretamente");
      return;
    }

    setLoading(true);

    let data = {
      email,
      password,
    };

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logo} alt="Logo Biblioteca" />

        <div className={styles.login}>
          <h1>Entrar</h1>

          <form onSubmit={handleLogin}>
            <Input placeholder="Digite seu email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Digite sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" loading={loading}>
              Entrar
            </Button>
          </form>

          <Link href="/cadastro" className={styles.text}>
            Crie uma conta
          </Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
