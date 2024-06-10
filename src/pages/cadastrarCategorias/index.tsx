import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";

export default function RegisterCategory() {
  const [name, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function handleRegister(event) {
    event.preventDefault();
    if (name === "") {
      toast.error("Preencha os dados corretamente");
      return;
    }

    setLoading(true);

    let data = {
        name,
      
    };

    const response = await api.post("/category", data);;

    setLoading(false);

    toast.success("Categoria cadastrada com sucesso!");
    setCategoryName("");
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Cadastrar Livro</title>
      </Head>
      <div>
        <AdminHeader />
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <h1 className={styles.title}>Sistema NossaBiblioteca - Cadastro</h1>
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.teste1}>
                <span>Nome da Categoria</span>
                <input type="text" placeholder="Aventura" className={styles.input} value={name} onChange={(e) => setCategoryName(e.target.value)} required />
              </div>
              <button type="submit" className={styles.buttonAdd}>
                Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
