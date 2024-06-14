import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span>&copy; 2024 NossaBiblioteca. Todos os direitos reservados.</span>
        <div className={styles.links}>
          <Link href={"/contato"}>Contato</Link>
          <Link href={"/sobre"}>Sobre</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
