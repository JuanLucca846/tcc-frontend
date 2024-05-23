import Link from "next/link";
import styles from "./styles.module.scss";
import { FaHome, FaBook, FaSearch } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul className={styles.menuNav}>
          <li>
            <Link href="/inicio">
              Página Inicial <FaHome />
            </Link>
          </li>
          <li>
            <Link href="/todosLivros">
              Todos os Livros <FaBook />
            </Link>
          </li>
          <li>
            <Link href="/cadastrarLivros">
              Cadastrar Livros <IoIosAddCircle />
            </Link>
          </li>
          <li>
            <Link href="/pesquisar-livros">
              Pesquisar Livros <FaSearch />
            </Link>
          </li>
          <li>
            <Link href="/controle-de-livros">Controle de Livros</Link>
          </li>
          <li>
            <Link href="/livros-pendentes">Livros Pendentes</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
