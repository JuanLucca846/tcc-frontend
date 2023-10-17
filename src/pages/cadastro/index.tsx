import { FormEvent, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";
import logo from "../../../public/logonossabiblioteca.svg";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (name === "" || cpf === "" || email === "" || password === "") {
      toast.error("Preencha os dados corretamente");
      return;
    }

    setLoading(true);

    let data = {
      name,
      cpf,
      email,
      password,
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logo} alt="Logo Biblioteca" />

        <div className={styles.login}>
          <h1>Criar uma conta</h1>

          <form onSubmit={handleRegister}>
            <Input placeholder="Digite seu nome" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Digite seu cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <Input placeholder="Digite seu email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Digite sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" loading={loading}>
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
