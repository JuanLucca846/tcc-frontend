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
import React from "react";
import BookModal from "../../components/Modal";

type BookProps = {
  booksList: {
    total: number;
    totalPage: number;
    books: Array<{
      id: number;
      title: string;
      author: string;
      category: string;
      quantity: number;
      coverImage: string;
      description: string;
    }>;
  };
};

type RentProps = {
  userId: number;
  bookId: number;
};

export default function Library({ booksList }: BookProps) {
  const [books, setBooks] = useState<BookProps["booksList"]["books"]>(booksList.books || []);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<BookProps["booksList"]["books"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (search) {
      const filtered = books.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books || []);
    }
  }, [search, books]);

  const user = useContext(AuthContext);

  async function fetchBooks() {
    try {
      const response = await api.get("/book", {
        params: {
          skip: Number(currentPage),
          take: Number(itemsPerPage),
        },
      });

      const booksData = response.data;

      if (currentPage === 1) {
        setBooks(booksData.books);
      } else {
        setBooks((prevBooks) => [...prevBooks, ...booksData.books]);
      }

      return booksData;
    } catch (error) {
      toast.error("Erro ao carregar os livros");
      console.error("Erro ao carregar os livros:", error);
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

  async function deleteBook(bookId: number) {
    try {
      await api.delete(`/book/${bookId}`);

      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);

      toast.success("Livro excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir o livro");
      console.error("Erro ao excluir o livro:", error);
    }
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData?.books || []);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    };

    loadBooks();
  }, [currentPage, itemsPerPage, search]);

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Início</title>
      </Head>
      <div>
        <Header />
        <div className={styles.availableBooks}>
          <h2>Livros Disponíveis</h2>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Buscar livros..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchBook} />
            <FiSearch color="#109152" size={24} className={styles.fiSearch} />
          </div>
          <ul className={styles.bookList}>
            {filteredBooks.map((book) => (
              <li
                key={book.id}
                className={styles.bookItem}
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedBook(book);
                }}
              >
                <div className={styles.bookDetails}>
                  <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>Autor: {book.author}</p>
                  <p className={styles.bookCategory}>Categoria: {book.category}</p>
                  <p className={styles.bookQuantity}>Quantidade: {book.quantity}</p>
                  <button type="button" className={styles.buttonBooking} onClick={() => rentBook({ userId: user.user?.id || 0, bookId: book.id })}>
                    Alugar
                  </button>
                  <button type="button" className={styles.buttonDelete} onClick={() => deleteBook(book.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.paginationContainer}>
        <button type="button" className={styles.buttonPrevious} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <button type="button" className={styles.buttonNext} onClick={() => paginate(currentPage + 1)}>
          Próxima
        </button>
        <select className={styles.selectionPagination} onChange={(e) => changeItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
          <option value={16}>16 por página</option>
          <option value={32}>32 por página</option>
        </select>
      </div>
      {isModalOpen && (
        <BookModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
      )}
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  try {
    const response = await api.get("/book");
    const books = response.data;

    return {
      props: {
        booksList: books,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      props: {
        booksList: { total: 0, totalPage: 0, books: [] },
      },
    };
  }
});
