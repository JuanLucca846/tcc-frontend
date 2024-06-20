import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles.module.scss";
import { Button } from "../../components/ui/button";
import Footer from "../../components/Footer";
import { format, isPast } from "date-fns";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
};

type Loan = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  dueDate: string;
};

function Index() {
  const { signOut, user, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [reservedBooks, setReservedBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Loan[]>([]);

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

        const borrowedBooksResponse = await api.get("/user/loans");
        const borrowedBooksData = borrowedBooksResponse.data.loans.map((loan: any) => ({
          ...loan.book,
          id: loan.book.id,
          dueDate: loan.dueDate,
        }));
        setBorrowedBooks(borrowedBooksData);
      } else {
        setUserData({ name: "", email: "" });
        setReservedBooks([]);
        setBorrowedBooks([]);
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
                  <img src={`https://tcc-backend-1.onrender.com${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
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

          <div className={styles.bookDetails}>
            <h2>Livros emprestados:</h2>
            {borrowedBooks.length > 0 ? (
              borrowedBooks.map((book) => (
                <div key={book.id} className={styles.bookCard}>
                  <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                  <div className={styles.bookInfo}>
                    <h3>{book.title}</h3>
                    <p>Autor: {book.author}</p>
                    <p>Data de devolução: {format(new Date(book.dueDate), "dd/MM/yyyy")}</p>
                    {isPast(new Date(book.dueDate)) && <p className={styles.overdueMessage}>Atrasado</p>}
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum livro emprestado.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Index;
