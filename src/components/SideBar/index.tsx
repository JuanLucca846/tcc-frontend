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
            <Link href="/cadastrarCategorias">
              Cadastrar Categoria <IoIosAddCircle />
            </Link>
          </li>
          <li>
            <Link href="/pesquisarLivros">
              Pesquisar Livros <FaSearch />
            </Link>
          </li>
          <li>
            <Link href="/controleReservas">Controle de Reservas</Link>
          </li>
          <li>
            <Link href="/controleEmprestimo">Controle de Emprestimos</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
