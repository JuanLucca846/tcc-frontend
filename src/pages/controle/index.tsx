import React, { useState, FormEvent, ChangeEvent } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../services/api";

interface AdminControlProps {}

const AdminControl: React.FC<AdminControlProps> = ({}) => {
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);
  const [selectedOption, setSelectedOption] = useState("cadastrar");

  const apiClient = setupAPIClient();

  const showToastError = (message: string) => {
    toast.error(`Erro: ${message}`);
  };

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (title === "" || author === "" || category === "" || quantity === "" || imageAvatar === null || description === "") {
        showToastError("Preencha todos os campos");
        return;
      }

      const data = new FormData();
      data.append("title", title);
      data.append("author", author);
      data.append("category", category);
      data.append("quantity", quantity);
      data.append("description", description);
      data.append("file", imageAvatar);

      const response = await apiClient.post("/book", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      toast.success("Livro cadastrado");
    } catch (error) {
      showToastError("Erro ao cadastrar o livro");
      console.error("Erro ao cadastrar o livro", error);
    } finally {
      setTitle("");
      setAuthor("");
      setCategory("");
      setQuantity("");
      setDescription("");
    }
  };

  const handleRemove = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (!bookId) {
        showToastError("Preencha o ID para remover");
        return;
      }

      const parseBookId = parseInt(bookId, 10);

      await apiClient.delete(`/book/${parseBookId}`);

      toast.success("Livro removido");
    } catch (error) {
      showToastError("Erro ao remover o livro");
    } finally {
      setBookId("");
    }
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (!bookId || !title || !author || !quantity) {
        showToastError("Preencha todos os campos");
        return;
      }

      const parseBookId = parseInt(bookId, 10);

      const data = {
        title,
        author,
        category,
        quantity: parseInt(quantity, 10),
      };

      await apiClient.put(`/book/${parseBookId}`, data);

      toast.success("Livro atualizado");
    } catch (error) {
      showToastError("Erro ao atualizar o livro");
    } finally {
      setBookId("");
      setTitle("");
      setAuthor("");
      setQuantity("");
    }
  };

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
                <label htmlFor="coverImage" className={styles.coverImageLabel}>
                  Selecione a imagem de capa do livro:
                </label>
                <form className={styles.form} onSubmit={handleRegister}>
                  <input type="file" accept="image/png, image/jpeg" className={styles.fileInput} onChange={handleFile} />

                  <input type="text" placeholder="Digite o nome do livro" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

                  <input type="text" placeholder="Digite o nome do autor" className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} />

                  <input type="text" placeholder="Digite o nome da categoria" className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} />

                  <textarea placeholder="Digite a descrição do livro" className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />

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

                  <input type="text" placeholder="Digite o novo título do livro" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

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
};

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});

export default AdminControl;
