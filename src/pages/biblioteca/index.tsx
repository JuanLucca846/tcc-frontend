import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

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
          <h2>Livros Disponiveis</h2>
          <ul>
            {books.map((book) => (
              <li key={book.id}>{book.title}</li>
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
