import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../minhaConta/styles.module.scss";

function index() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setName("");
    }
  }, [user]);

  async function fetchData() {
    try {
      const response = await api.get("/users");
      const { name } = response.data;
      setName(name);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Minha Conta</title>
      </Head>
      <UserHeader />
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Detalhes da conta</h1>
        <div className={styles.detailsContainer}>
          <div className={styles.userDetails}>Usuario</div>
          <div className={styles.bookDetails}>livros</div>
        </div>
      </div>
    </>
  );
}

export default index;
