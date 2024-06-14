import { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { FiLogOut } from "react-icons/fi";

export function UserHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut, user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setName("");
    }
  }, [user]);

  async function fetchData() {
    try {
      const response = await api.get("/users");
      const { name } = response.data;
      setName(name);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Pesquisar por:", searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/nossaBiblioteca"}>
          <div className={styles.headerTitle}>
            <img src="/logonossabiblioteca.svg" width={190} height={80} alt="Logo" />
            <h1>NossaBiblioteca</h1>
          </div>
        </Link>
        <nav className={styles.menuNav}>
          <Link href={"/catalogoLivros"}>
            <span>Ver Catalogo</span>
          </Link>
          {user ? (
            <>
              <Link href={"/minhaConta"}>
                <span>{name}</span>
              </Link>

              <button onClick={handleSignOut}>
                <FiLogOut color="#109152" size={24} />
              </button>
            </>
          ) : (
            <Link href={"/"}>
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
