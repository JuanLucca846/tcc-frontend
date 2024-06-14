import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import { AuthContext } from "../../contexts/AuthContext";
import Footer from "../../components/Footer";

type BookProps = {
  books: Array<{
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: string;
    shelf: string;
    bookcase: string;
    coverImage: string;
    description: string;
    status: string;
  }>;
};

export default function IndexUser({ books }: BookProps) {
  const [allBooks, setAllBooks] = useState<BookProps["books"]>(books || []);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/book", {
        params: {
          ...searchParams,
          page,
          limit: 12,
        },
      });
      const booksData = response.data;
      setAllBooks(booksData.books);
      setTotalPages(booksData.totalPage);
    } catch (error) {
      toast.error("Erro ao carregar os livros");
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchSubmit = async () => {
    setPage(1);
    fetchBooks();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      [name]: value,
    }));
  };

  const handleDescriptionToggle = (id: number) => {
    setExpandedDescription(id === expandedDescription ? null : id);
  };

  const handleReserve = async (bookId: number) => {
    try {
      if (!user) {
        router.push("/");
        return;
      }

      await api.post("/reservations", { userId: user.id, bookId, status: "reserved" });
      toast.success("Livro reservado com sucesso");
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/");
      } else {
        toast.error("Erro ao reservar o livro");
        console.error("Error reserving book:", error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Início</title>
      </Head>
      <div>
        <UserHeader />
        <div className={styles.pageContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <h2>Busca Avançada</h2>
              <p>Preencha os campos.</p>
              <div className={styles.searchFields}>
                <input type="text" name="isbn" value={searchParams.isbn} onChange={handleInputChange} placeholder="ISBN" />
                <input type="text" name="title" value={searchParams.title} onChange={handleInputChange} placeholder="Título" />
                <input type="text" name="author" value={searchParams.author} onChange={handleInputChange} placeholder="Autor" />
                <input type="text" name="category" value={searchParams.category} onChange={handleInputChange} placeholder="Categoria" />
              </div>
              <button className={styles.buttonAdd} onClick={handleSearchSubmit}>
                Buscar
              </button>
            </div>
          </div>
          <h2 className={styles.totalBookTitle}>
            Mostrando {allBooks.length} livros de {allBooks.length} livros
          </h2>
          <div className={styles.bookListContainer}>
            {allBooks.map((book) => (
              <div key={book.id} className={`${styles.bookCard} ${expandedDescription === book.id ? styles.expanded : ""}`}>
                <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                <h3>{book.title}</h3>
                <p>Autor: {book.author}</p>
                <p>
                  {expandedDescription === book.id ? book.description : `${book.description.substring(0, 100)}...`}
                  <span className={styles.toggleDescription} onClick={() => handleDescriptionToggle(book.id)}>
                    {expandedDescription === book.id ? " ver menos" : " ver mais"}
                  </span>
                </p>
                <div className={styles.bookActions}>
                  <span className={styles.bookStatus}>{book.status}</span>
                  <button type="submit" className={styles.buttonAdd} onClick={() => handleReserve(book.id)}>
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.paginationContainer}>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Próxima
            </button>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
}
