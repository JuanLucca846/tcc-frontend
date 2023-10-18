import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

type BookProps = {
  booksList: Array<{
    id: number;
    title: string;
    author: string;
    category: string;
    cover: string;
    quantity: number;
  }>;
};

export default function Library({ booksList }: BookProps) {
  const [books, setBooks] = useState(booksList || []);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksList || []);

  useEffect(() => {
    if (search) {
      const filtered = books.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [search, books]);

  const user = useContext(AuthContext);

  async function fetchBooks() {
    try {
      const response = await api.get("/book");

      const books = response.data;
      return books;
    } catch (error) {
      toast.error("Erro");
      console.log("Erro");
    }
  }

  useEffect(() => {
    async function loadBooks() {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData || []);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    }

    if (user) {
      loadBooks();
    }
  }, [user, fetchBooks]);

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Inicio</title>
      </Head>
      <div>
        <Header />
        <h1>Inicio</h1>
        <div>
          <h2 className={styles.availableBooks}>Livros Disponiveis</h2>
          <input type="text" placeholder="Buscar livros..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchBook} />
          <FiSearch color="#109152" size={24} />
          <ul className={styles.bookList}>
            {filteredBooks.map((book) => (
              <li key={book.id} className={styles.bookItem}>
                <img src={`/files/${book.cover}`} alt={book.title} className={styles.bookCover} />
                <div className={styles.bookDetails}>
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>Categoria: {book.category}</p>
                  <p>Quantidade: {book.quantity}</p>
                  <button type="submit" className={styles.buttonBooking}>
                    Alugar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  const response = await api.get("/book");

  const books = response.data;

  return {
    props: {
      booksList: books,
    },
  };
});
