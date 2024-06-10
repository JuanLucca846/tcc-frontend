import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";

export default function RegisterBook() {
  const [isbn, setIsbn] = useState("");
  const [shelf, setShelf] = useState("");
  const [bookcase, setBookcase] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log({
      title,
      author,
      description,
      isbn,
      shelf,
      bookcase,
      coverImage,
      selectedCategory
    });

    if (!coverImage) {
      toast.error("Por favor, selecione uma imagem de capa.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Por favor, selecione uma categoria.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("isbn", isbn);
    formData.append("shelf", shelf);
    formData.append("bookcase", bookcase);
    formData.append("file", coverImage);
    formData.append("categoryId", selectedCategory);

    try {
      const response = await api.post("/book", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Livro cadastrado com sucesso!");
      setIsbn("");
      setShelf("");
      setBookcase("");
      setTitle("");
      setAuthor("");
      setDescription("");
      setCoverImage(null);
      setSelectedCategory("");
    } catch (error) {
      toast.error("Erro ao cadastrar o livro");
    }
  };

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Cadastrar Livro</title>
      </Head>
      <div>
        <AdminHeader />
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <h1 className={styles.title}>Sistema NossaBiblioteca - Cadastro</h1>
            <form className={styles.form} onSubmit={handleRegister}>
              <label htmlFor="coverImage" className={styles.coverImageLabel}>
                Selecione a imagem de capa:
              </label>
              <input type="file" accept="image/png, image/jpeg" className={styles.fileInput} onChange={handleFile} required />

              <div className={styles.teste}>
                <div className={styles.teste1}>
                  <span>ISBN</span>
                  <input type="text" placeholder="ISBN" className={styles.input} value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
                </div>
                <div className={styles.teste1}>
                  <span>Prateleira</span>
                  <input type="text" placeholder="Prateleira" className={styles.input} value={shelf} onChange={(e) => setShelf(e.target.value)} required />
                </div>
                <div className={styles.teste1}>
                  <span>Estante</span>
                  <input type="text" placeholder="Estante" className={styles.input} value={bookcase} onChange={(e) => setBookcase(e.target.value)} required />
                </div>
              </div>
              <div className={styles.teste1}>
                <span>Título</span>
                <input type="text" placeholder="Título" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className={styles.teste1}>
                <span>Autor</span>
                <input type="text" placeholder="Autor" className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </div>
              <div className={styles.teste1}>
                <span>Descrição</span>
                <textarea placeholder="Descrição" className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className={styles.teste1}>
                <span>Categoria</span>
                <select className={styles.input} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.buttonAdd}>
                Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
