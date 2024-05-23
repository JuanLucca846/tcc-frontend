// IndexUser.tsx

import Head from "next/head";
import React, { useEffect, useState } from "react";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

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
  }>;
};

export default function IndexUser({ books }: BookProps) {
  const [allBooks, setAllBooks] = useState<BookProps["books"]>(books || []);
  const [searchParams, setSearchParams] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/book");
        const booksData = response.data;
        setAllBooks(booksData.books);
      } catch (error) {
        toast.error("Erro ao carregar os livros");
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleSearchSubmit = async () => {
    try {
      const response = await api.get("/book", { params: searchParams });
      const booksData = response.data;
      setAllBooks(booksData.books);
    } catch (error) {
      toast.error("Erro ao buscar os livros");
      console.error("Error searching for books:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      [name]: value,
    }));
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
              <div key={book.id} className={styles.bookCard}>
                <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                <h3>{book.title}</h3>
                <p>Autor: {book.author}</p>
                <p>{book.description}</p>
                <button type="submit" className={styles.buttonAdd}>
                  Reservar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
