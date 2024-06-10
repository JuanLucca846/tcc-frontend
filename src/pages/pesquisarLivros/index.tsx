import Head from "next/head";
import React, { useState, FormEvent } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from '../pesquisarLivros/styles.module.scss';
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";

type Book = {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: {
    name: string;
  };
  shelf: string;
  bookcase: string;
  coverImage: string;
  description: string;
};

export default function SearchBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.get(`/book`, {
        params: {
          title: searchTerm,
        },
      });
      setResults(response.data.books);
    } catch (error) {
      toast.error("Erro ao buscar livros");
      console.error("Error fetching books:", error);
    }
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Pesquisar</title>
      </Head>
      <div>
        <AdminHeader />
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <h1 className={styles.title}>Sistema NossaBiblioteca - Pesquisar</h1>
            <div className={styles.searchBox}>
              <form className={styles.searchForm} onSubmit={handleSearch}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.buttonSearch} type="submit">
                  Buscar
                </button>
              </form>
            </div>
            <div className={styles.results}>
              {results.length > 0 ? (
                <table className={styles.bookTable}>
                  <thead>
                    <tr>
                      <th>Isbn</th>
                      <th>Capa</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Categoria</th>
                      <th>Prateleira</th>
                      <th>Estante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((book) => (
                      <tr key={book.id}>
                        <td>{book.isbn}</td>
                        <td>
                          <img
                            src={`http://localhost:3000${book.coverImage}`}
                            alt={book.title}
                            className={styles.bookCoverImage}
                          />
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category.name}</td>
                        <td>{book.shelf}</td>
                        <td>{book.bookcase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhum livro encontrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
