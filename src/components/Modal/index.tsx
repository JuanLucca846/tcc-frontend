// components/BookModal.tsx
import React from "react";
import styles from "../Modal/styles.module.scss";

interface BookModalProps {
  onClose: () => void;
  book: { title: string; description: string } | null;
}

const BookModal: React.FC<BookModalProps> = ({ onClose, book }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Titulo: {book?.title}</h2>
        <p>Descrição: {book?.description}</p>
        <button className={styles.buttonClose} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default BookModal;
