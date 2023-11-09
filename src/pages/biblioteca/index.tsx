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
    quantity: number;
  }>;
};

type RentProps = {
  userId: number;
  bookId: number;
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

  async function rentBook({ userId, bookId }: RentProps) {
    if (user) {
      try {
        const response = await api.post("/rentbook", { userId, bookId });

        const updatedBooks = books.map((book) => {
          if (book.id === bookId) {
            const updatedQuantity = book.quantity - 1;
            return { ...book, quantity: updatedQuantity };
          }
          return book;
        });

        setBooks(updatedBooks);

        toast.success("Livro alugado com sucesso");
      } catch (error) {
        toast.error("Erro ao alugar o livro");
        console.error("Erro ao alugar o livro:", error);
      }
    }
  }

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData || []);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    };

    loadBooks();
  }, []);

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Inicio</title>
      </Head>
      <div>
        <Header />
        <div className={styles.availableBooks}>
          <h2>Livros Disponiveis</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Buscar livros..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchBook} />
            <FiSearch color="#109152" size={24} className={styles.fiSearch} />
          </div>
          <ul className={styles.bookList}>
            {filteredBooks.map((book) => (
              <li key={book.id} className={styles.bookItem}>
                <div className={styles.bookDetails}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>Autor: {book.author}</p>
                  <p className={styles.bookCategory}>Categoria: {book.category}</p>
                  <p className={styles.bookQuantity}>Quantidade: {book.quantity}</p>
                  <button type="button" className={styles.buttonBooking} onClick={() => rentBook({ userId: user.user.id || 0, bookId: book.id })}>
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
