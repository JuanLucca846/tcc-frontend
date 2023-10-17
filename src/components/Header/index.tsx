import { useContext } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/biblioteca"}>
          <img src="/logonossabiblioteca.svg" width={190} height={80} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/livros">Meus livros</Link>

          <Link href="/controle">Controle</Link>

          <button onClick={signOut}>
            <FiLogOut color="#109152" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
