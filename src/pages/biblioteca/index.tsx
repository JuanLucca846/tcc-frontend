import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from "next/head"
import { Header } from "../../components/Header"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"

export default function Library(){
    const {user, fetchBooks } = useContext(AuthContext);
    const [ books, setBooks ] = useState([]);

    useEffect(() => {
        async function loadBooks() {
            try {
                const booksData = await fetchBooks();
                setBooks(booksData);
            } catch (error) {
                console.error('Error loading books:', error);
                // Handle the error appropriately (e.g., display an error message)
            }
        }

        if (user) {
            loadBooks();
        }
    }, [user, fetchBooks]);

    return(
        <>
        <Head>
            <title>NossaBiblioteca - Inicio</title>
        </Head>
        <div>
            <Header/>
            <h1>Inicio</h1>
            <div>
                <h2>Livros Disponiveis</h2>
                <ul>
                    {books.map((book) => (
                        <li key={book.id}>{book.title}</li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return{
        props: {}
    }
})