import React, { useEffect, useState } from "react";
import Head from "next/head";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import Carrossel from "../../components/Carrosel/index";

type BookProps = {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  shelf: string;
  bookcase: string;
  coverImage: string;
  description: string;
};

type CategoryProps = {
  id: number;
  name: string;
};

type BooksByCategory = {
  [category: string]: BookProps[];
};

export default function IndexUser() {
  const [booksByCategory, setBooksByCategory] = useState<BooksByCategory>({});
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoriesAndBooks() {
      try {
        const categoriesResponse = await api.get("/category");
        const categoriesData = categoriesResponse.data.categories;
        setCategories(categoriesData);

        const booksData: BooksByCategory = {};
        for (const category of categoriesData) {
          const booksResponse = await api.get("/book", {
            params: { category: category.name },
          });
          booksData[category.name] = booksResponse.data.books;
        }
        setBooksByCategory(booksData);
        setIsLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar os livros e categorias");
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchCategoriesAndBooks();
  }, []);

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Catálogo</title>
      </Head>
      <div>
        <UserHeader />
        <div className={styles.pageContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <h1>Bem-vindo à NossaBiblioteca.</h1>
              <p>Livros Disponíveis: {Object.values(booksByCategory).flat().length}</p>
            </div>
          </div>

          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            categories &&
            categories.map((category) => (
              <div key={category.id} className={styles.categoryContainer}>
                <h2>{category.name}</h2>
                <Carrossel books={booksByCategory[category.name]} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
