import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import React, { useState, useEffect, FormEvent } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";
import { MdDelete } from "react-icons/md";

type BookProps = {
  books: Array<{
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: {
      id: number,
      name: string,
    };
    shelf: string;
    bookcase: string;
    coverImage: string;
    description: string;
    status: string;
  }>;
};

export default function AllBooks({ books }: BookProps) {
  const [allBooks, setAllBooks] = useState<BookProps["books"]>(books || []);
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/book");
        const booksData = response.data;
        console.log(booksData)
        setAllBooks(booksData.books);
      } catch (error) {
        toast.error("Erro ao carregar os livros");
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleRemove = async (bookId: Number) => {
    try {
      if (!bookId) {
        toast.error("Preencha o ID para remover");
        return;
      }

      await api.delete(`/book/${bookId}`);
      const updatedBooks = allBooks.filter((book) => book.id !== bookId);
      setAllBooks(updatedBooks);

      toast.success("Livro removido");
    } catch (error) {
      toast.error("Erro ao remover o livro");
    } finally {
      setBookId("");
    }
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Início</title>
      </Head>
      <div>
        <AdminHeader />
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <h1 className={styles.title}>Sistema NossaBiblioteca - Livros</h1>
            <table className={styles.bookTable}>
              <thead>
                <tr>
                  <th>Isbn</th>
                  <th>Status</th>
                  <th>Capa</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoria</th>
                  <th>Prateleira</th>
                  <th>Estante</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
                {allBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.isbn}</td>
                    <td>{book.status}</td>
                    <td>
                      <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category.name}</td>
                    <td>{book.shelf}</td>
                    <td>{book.bookcase}</td>
                    <td>
                      <MdDelete size={26} onClick={() => handleRemove(book.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
