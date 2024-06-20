import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AdminHeader } from "../../components/AdminHeader/indext";
import { format } from "date-fns";

type LoanProps = {
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
  dueDate: string;
  returnedAt: string;
};

export default function AllLoansControl() {
  const [allLoans, setAllLoans] = useState<LoanProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/loans");
        const loanData = response.data;
        console.log(loanData);
        if (Array.isArray(loanData.loans)) {
          setAllLoans(loanData.loans);
        } else {
          console.error("Unexpected response data:", loanData);
          setAllLoans([]);
        }
      } catch (error) {
        toast.error("Erro ao carregar as reservas");
        console.error("Error fetching data:", error);
        setAllLoans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleReturnBook = async (loanId: number) => {
    try {
      await api.put(`/returnLoan/${loanId}`);
      toast.success("Livro retornado com sucesso");
      const response = await api.get("/loans");
      const loansData = response.data;
      if (Array.isArray(loansData.loans)) {
        setAllLoans(loansData.loans);
      }
    } catch (error) {
      toast.error("Erro ao retornar livro");
      console.error("Error moving reservation to loan:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  const loansNotReturned = allLoans.filter((loan) => !loan.returnedAt);
  const loansReturned = allLoans.filter((loan) => loan.returnedAt);

  const filteredLoansNotReturned = loansNotReturned.filter((loan) => loan.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredLoansReturned = loansReturned.filter((loan) => loan.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <h1 className={styles.title}>Sistema NossaBiblioteca - Empréstimos</h1>
            <input type="text" placeholder="Buscar por nome do usuário" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <table className={styles.reservationTable}>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>ISBN</th>
                  <th>Capa</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Devolvido em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoansNotReturned.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.user.name}</td>
                    <td>{loan.book.isbn}</td>
                    <td>
                      <img src={`https://tcc-backend-1.onrender.com${loan.book.coverImage}`} alt={loan.book.title} className={styles.bookCoverImage} />
                    </td>
                    <td>{loan.book.title}</td>
                    <td>{loan.book.author}</td>
                    <td>{loan.book.status}</td>
                    <td>{formatDate(loan.dueDate)}</td>
                    <td>{loan.returnedAt ? formatDate(loan.returnedAt) : ""}</td>
                    <td>
                      {loan.book.status === "Emprestado" && (
                        <button className={styles.button} onClick={() => handleReturnBook(loan.id)}>
                          Devolução
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                {filteredLoansReturned.map((loan) => (
                  <tr key={loan.id} className={styles.returned}>
                    <td>{loan.user.name}</td>
                    <td>{loan.book.isbn}</td>
                    <td>
                      <img src={`http://localhost:3000${loan.book.coverImage}`} alt={loan.book.title} className={styles.bookCoverImage} />
                    </td>
                    <td>{loan.book.title}</td>
                    <td>{loan.book.author}</td>
                    <td>{loan.book.status}</td>
                    <td>{formatDate(loan.dueDate)}</td>
                    <td>{formatDate(loan.returnedAt)}</td>
                    <td></td>
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
