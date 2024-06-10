import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserHeader } from "../../components/UserHeader";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { Typewriter } from 'react-simple-typewriter';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from "./styles.module.scss";
import { AuthContext } from "../../contexts/AuthContext";
import Footer from "../../components/Footer";

type BookProps = {
  books: Array<{
    id: number;
    isbn: string;
    title: string;
    author: string;
    coverImage: string;
  }>;
};

export default function IndexUser({ books }: BookProps) {
  const [allBooks, setAllBooks] = useState<BookProps["books"]>(books || []);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/book");
      setAllBooks(response.data.books);
    } catch (error) {
      toast.error("Erro ao carregar os livros");
      console.error("Error fetching data:", error);
    }
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Início</title>
      </Head>
      <div>
        <UserHeader />
        <div className={styles.pageContainer}>
          <h1 className={styles.typewriter}>
            <Typewriter
              words={['Bem-vindo à NossaBiblioteca']}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>
          <div className={styles.carouselContainer}>
            <Slider {...settings}>
              {allBooks.map((book) => (
                <div key={book.id} className={styles.bookCard}>
                  <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <button className={styles.buttonAdd} onClick={() => handleReserve(book.id)}>
                    Reservar
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

