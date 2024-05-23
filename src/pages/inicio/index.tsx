import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { AdminHeader } from "../../components/AdminHeader/indext";
import { FaBookOpenReader, FaClockRotateLeft, FaRegUser, FaRightLong } from "react-icons/fa6";
import { AuthContext } from "../../contexts/AuthContext";

export default function Index() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPendingBooks, setTotalPendingBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/status");
        const { totalBooks, totalPendingBooks, totalUsers, totalBorrowedBooks } = response.data;
        setTotalBooks(totalBooks);
        setTotalPendingBooks(totalPendingBooks);
        setTotalUsers(totalUsers);
        setTotalBorrowedBooks(totalBorrowedBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!user) {
    return <p>Carregando...</p>;
  }

  let adminPage;

  if (user.admin === true) {
    adminPage = (
      <>
        <Head>
          <title>NossaBiblioteca - Início</title>
        </Head>
        <div>
          <AdminHeader />

          <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
              <h1 className={styles.title}> Sistema NossaBiblioteca</h1>
              <div className={styles.stats}>
                <div className={styles.teste}>
                  <div className={styles.stat}>
                    <FaBookOpenReader size={26} />
                    <h2>Livros Cadastrados</h2>
                    <span>Total: {totalBooks}</span>
                  </div>
                  <div className={styles.stat}>
                    <FaClockRotateLeft size={26} />
                    <h2>Livros Pendentes</h2>
                    <span>Total: {totalPendingBooks}</span>
                  </div>
                </div>
                <div className={styles.teste}>
                  <div className={styles.stat}>
                    <FaRegUser size={26} />
                    <h2>Usuários Cadastrados</h2>
                    <span>Total: {totalUsers}</span>
                  </div>
                  <div className={styles.stat}>
                    <FaRightLong size={26} />
                    <h2>Livros Emprestados</h2>
                    <span>Total: {totalBorrowedBooks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{adminPage}</>;
}
