import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles.module.scss";
import { Button } from "../../components/ui/button";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
};

function Index() {
  const { signOut, user, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [reservedBooks, setReservedBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      if (user) {
        const userResponse = await api.get("/users");
        const { name, email } = userResponse.data;
        setUserData({ name, email });

        const booksResponse = await api.get("/user/reservations");
        const reservedBooksData = booksResponse.data.books.map((reservation: any) => ({
          ...reservation.book,
          id: reservation.book.id,
        }));
        setReservedBooks(reservedBooksData);
      } else {
        setUserData({ name: "", email: "" });
        setReservedBooks([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const { name, email } = userData;

  const handleSignOut = async () => {
    await signOut();
    setUser(null); 
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Minha Conta</title>
      </Head>
      <UserHeader />
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Detalhes da conta</h1>
        <div className={styles.detailsContainer}>
          <div className={styles.userDetails}>
            <h2>Nome do usuário:</h2>
            <p>{name}</p>
            <h2>Email:</h2>
            <p>{email}</p>           
            <div className={styles.logoutButtonContainer}>
              <Button type="submit" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>
          
          <div className={styles.bookDetails}>
            <h2>Livros reservados:</h2>
            {reservedBooks.length > 0 ? (
              reservedBooks.map((book) => (
                <div key={book.id} className={styles.bookCard}>
                  <img
                    src={`http://localhost:3000${book.coverImage}`}
                    alt={book.title}
                    className={styles.bookCoverImage}
                  />
                  <div className={styles.bookInfo}>
                    <h3>{book.title}</h3>
                    <p>Autor: {book.author}</p>
                    
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum livro reservado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
