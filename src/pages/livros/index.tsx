import Head from "next/head";
import { Header } from "../../components/Header";
import { api } from "../../services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../livros/styles.module.scss";

type RentedBookProps = {
  rentedBooksList: Array<{
    id: number;
    bookId: number;
    book: {
      title: string;
      author: string;
    };
  }>;
};

export default function MyBooks({ rentedBooksList }: RentedBookProps) {
  const [myRentedBooks, setMyRentedBooks] = useState(rentedBooksList || []);

  const user = useContext(AuthContext);

  async function fetchRentedBooks(userId) {
    try {
      const response = await api.get(`/user/${userId}/rentedbooks`);

      const rentedBooks = response.data.map((rentedBook) => ({
        id: rentedBook.id,
        bookId: rentedBook.bookId,
        book: {
          title: rentedBook.book.title,
          author: rentedBook.book.author,
        },
      }));

      return rentedBooks;
    } catch (error) {
      toast.error("Erro");
      console.log("Erro");
    }
  }

  const returnBook = async (userId: number, bookId: number) => {
    console.log("User ID:", userId);
    console.log("Book ID:", bookId);

    try {
      await api.post("/returnrentedbook", { userId, bookId });

      setMyRentedBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
    } catch (error) {
      toast.error("Erro");
      console.log("Erro");
    }
  };

  useEffect(() => {
    console.log(user);
    const loadRentedBooks = async () => {
      try {
        const rentedBooksData = await fetchRentedBooks(user.user.id);

        console.log("Rented books data:", rentedBooksData);
        setMyRentedBooks(rentedBooksData || []);
      } catch (error) {
        console.error("Error loading rented books:", error);
      }
    };

    loadRentedBooks();
  }, []);

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Meus livros</title>
      </Head>
      <div>
        <Header />
        <div className={styles.myBooks}>
          <h2>Meus Livros Alugados</h2>
          <ul className={styles.rentedBooksList}>
            {myRentedBooks.map((rentedBook) => (
              <li key={rentedBook.id} className={styles.rentedBookItem}>
                <div className={styles.rentedBooksDetails}>
                  <h3 className={styles.bookTitle}>Título: {rentedBook.book.title}</h3>
                  <p className={styles.bookAuthor}>Autor: {rentedBook.book.author}</p>
                  <button type="button" className={styles.buttonReturnBooking} onClick={() => returnBook(user.user.id, rentedBook.bookId)}>
                    Devolver
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <h2>Sugestão de livros</h2>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="Sugerir livro" className={styles.searchBook} />
        </div>
      </div>
    </>
  );
}
