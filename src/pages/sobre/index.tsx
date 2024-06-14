import React from "react";
import styles from "../sobre/styles.module.scss";
import { UserHeader } from "../../components/UserHeader";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <>
      <UserHeader />
      <div className={styles.page}>
        <h1>NossaBiblioteca</h1>
        <p>
          NossaBiblioteca é uma plataforma inovadora projetada para simplificar e aprimorar a experiência dos alunos e bibliotecários em relação ao gerenciamento de livros e recursos da biblioteca.
        </p>
        <p>
          <br />
        </p>
        <p>Nossos principais recursos são:</p>
        <p>
          <br />
        </p>
        <ul>
          <li>Reserva de Livros Simplificada.</li>
          <p>
            <br />
          </p>
          <li>Sugestão de Novos Livros.</li>
          <p>
            <br />
          </p>
          <li>Gerenciamento Eficiente para Bibliotecários.</li>
        </ul>
      </div>
      <Footer />
    </>
  );
}
