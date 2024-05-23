import { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";

export function UserHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    console.log("Pesquisar por:", searchQuery);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/usuario"}>
          <div className={styles.headerTitle}>
            <img src="/logonossabiblioteca.svg" width={190} height={80} />
            <h1>NossaBiblioteca</h1>
          </div>
        </Link>

        <nav className={styles.menuNav}>
          <Link href={"/catalogo"}>
            <span>Ver Catálogo</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={handleSearchChange} />
            <button type="submit">Buscar</button>
          </form>

          <Link href={"/"}>
            <span>Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
