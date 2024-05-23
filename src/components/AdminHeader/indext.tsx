import { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";

export function AdminHeader() {
  const { signOut } = useContext(AuthContext);
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");
        const { name } = response.data;
        setName(name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/inicio"}>
          <div className={styles.headerTitle}>
            <img src="/logonossabiblioteca.svg" width={190} height={80} />
            <h1>NossaBiblioteca</h1>
          </div>
        </Link>

        <nav className={styles.menuNav}>
          <span>Bem vindo: {name}</span>

          <button onClick={signOut}>
            <FiLogOut color="#109152" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
