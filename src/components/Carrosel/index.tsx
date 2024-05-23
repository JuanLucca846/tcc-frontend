import React from "react";
import styles from "./styles.module.scss";

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

type CarrosselProps = {
  books: BookProps[];
};

const Carrossel: React.FC<CarrosselProps> = ({ books }) => {
  return (
    <div className={styles.carrosselContainer}>
      {books.map((book) => (
        <div key={book.id} className={styles.bookCard}>
          <img src={`http://localhost:3000${book.coverImage}`} alt={book.title} className={styles.bookCoverImage} />
          <h3>{book.title}</h3>
          <p>Autor: {book.author}</p>
          <p>{book.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Carrossel;
