import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";

type ReservationProps = {
  id: number;
  book: {
    id: number;
    isbn: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    status: string;
  };
  user: {
    name: string;
  };
  reservedAt: string;
};

export default function AllReservationsControl() {
  const [allReservations, setAllReservations] = useState<ReservationProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/reservationsAdmin");
        const reservationsData = response.data;
        console.log(reservationsData);
        if (Array.isArray(reservationsData.reservations)) {
          setAllReservations(reservationsData.reservations);
        } else {
          console.error("Unexpected response data:", reservationsData);
          setAllReservations([]);
        }
      } catch (error) {
        toast.error("Erro ao carregar as reservas");
        console.error("Error fetching data:", error);
        setAllReservations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleMoveToLoan = async (reservationId: number) => {
    try {
      await api.post(`/reservationsClose/${reservationId}`);
      toast.success("Reserva movida para empréstimo com sucesso");
      const response = await api.get("/reservationsAdmin");
      const reservationsData = response.data;
      if (Array.isArray(reservationsData.reservations)) {
        setAllReservations(reservationsData.reservations);
      }
    } catch (error) {
      toast.error("Erro ao mover reserva para empréstimo");
      console.error("Error moving reservation to loan:", error);
    }
  };

  const filteredReservations = allReservations.filter((reservation) => reservation.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Reservas</title>
      </Head>
      <div className={styles.page}>
        <AdminHeader />
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <h1 className={styles.title}>Sistema NossaBiblioteca - Reservas</h1>
            <input type="text" placeholder="Buscar por nome de usuário" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <table className={styles.reservationTable}>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>ISBN</th>
                  <th>Capa</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.user.name}</td>
                    <td>{reservation.book.isbn}</td>
                    <td>
                      <img src={`http://localhost:3000${reservation.book.coverImage}`} alt={reservation.book.title} className={styles.bookCoverImage} />
                    </td>
                    <td>{reservation.book.title}</td>
                    <td>{reservation.book.author}</td>
                    <td>{reservation.book.status}</td>
                    <td>
                      {reservation.book.status === "Reservado" && (
                        <button className={styles.button} onClick={() => handleMoveToLoan(reservation.id)}>
                          Efetuar Empréstimo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
