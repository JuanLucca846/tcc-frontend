import React, { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../services/api";

export default function AdminControl() {
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedOption, setSelectedOption] = useState("cadastrar");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      console.log("Starting registration...");

      if (title === "" || author === "" || category === "" || quantity === "") {
        toast.error("Preencha todos os campos");
        return;
      }

      const data = {
        title,
        author,
        category,
        quantity: parseInt(quantity, 10),
      };

      const apiClient = setupAPIClient();

      console.log("Sending POST request...");
      await apiClient.post("/book", data);

      toast.success("Livro cadastrado");
      console.log("Livro cadastrado");
    } catch (error) {
      toast.error("Erro");
      console.log("Erro");
    } finally {
      setTitle("");
      setAuthor("");
      setCategory("");
      setQuantity("");
    }
  }

  async function handleRemove(event: FormEvent) {
    event.preventDefault();

    try {
      console.log("Removing...");

      if (bookId === "") {
        toast.error("Preencha o ID para remover");
        return;
      }

      const parseBookId = parseInt(bookId, 10);

      const apiClient = setupAPIClient();

      console.log("Sending DELETE request...");
      await apiClient.delete(`/book/${parseBookId}`);

      toast.success("Livro removido");
      console.log("Livro removido");
    } catch (error) {
      toast.error("Erro");
      console.log("Erro");
    } finally {
      setBookId("");
    }
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();

    try {
      console.log("Updating...");

      if (bookId === "" || title === "" || author === "" || quantity === "") {
        toast.error("Preencha todos os campos");
        return;
      }

      const parseBookId = parseInt(bookId, 10);

      const data = {
        title,
        author,
        category,
        quantity: parseInt(quantity, 10),
      };

      const apiClient = setupAPIClient();

      console.log("Sending PUT request...");
      await apiClient.put(`/book/${parseBookId}`, data);

      toast.success("Livro atualizado");
      console.log("Livro atualizado");
    } catch (error) {
      toast.error("Erro");
      console.log("Erro", error);
    } finally {
      setBookId("");
      setTitle("");
      setAuthor("");
      setQuantity("");
    }
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Controle dos livros</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.buttonContainer}>
            <button className={`${styles.chooseFormAdd} ${selectedOption === "cadastrar" ? styles.active : ""}`} onClick={() => setSelectedOption("cadastrar")}>
              Cadastrar
            </button>
            <button className={`${styles.chooseFormRemove} ${selectedOption === "remover" ? styles.active : ""}`} onClick={() => setSelectedOption("remover")}>
              Remover
            </button>
            <button className={`${styles.chooseFormUpdate} ${selectedOption === "editar" ? styles.active : ""}`} onClick={() => setSelectedOption("editar")}>
              Editar
            </button>
          </div>
          <div className={styles.content}>
            {selectedOption === "cadastrar" && (
              <>
                <h1>Cadastrar livro</h1>
                <form className={styles.form} onSubmit={handleRegister}>
                  <input type="text" placeholder="Digite o nome do livro" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

                  <input type="text" placeholder="Digite o nome do autor" className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} />

                  <input type="text" placeholder="Digite o nome da categoria" className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} />

                  <input type="number" placeholder="Digite a quantidade de livros" className={styles.input} value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                  <button type="submit" className={styles.buttonAdd}>
                    Adicionar
                  </button>
                </form>
              </>
            )}
            {selectedOption === "remover" && (
              <>
                <h1>Remover livro</h1>
                <form className={styles.form} onSubmit={handleRemove}>
                  <input type="text" placeholder="Digite o ID do livro" className={styles.input} value={bookId} onChange={(e) => setBookId(e.target.value)} />

                  <button type="submit" className={styles.buttonRemove}>
                    Remover
                  </button>
                </form>
              </>
            )}
            {selectedOption === "editar" && (
              <>
                <h1>Editar livro</h1>
                <form className={styles.form} onSubmit={handleUpdate}>
                  <input type="text" placeholder="Digite o ID do livro que deseja atualizar" className={styles.input} value={bookId} onChange={(e) => setBookId(e.target.value)} />

                  <input type="text" placeholder="Digite o novo titulo do livro" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

                  <input type="text" placeholder="Digite o novo nome do autor" className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} />

                  <input type="number" placeholder="Digite a nova quantidade de livros" className={styles.input} value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                  <button type="submit" className={styles.buttonUpdate}>
                    Atualizar
                  </button>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
