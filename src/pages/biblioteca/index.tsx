import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from "next/head"
import { Header } from "../../components/Header"

export default function Library(){
    return(
        <>
        <Head>
            <title>NossaBiblioteca - Inicio</title>
        </Head>
        <div>
            <Header/>
            <h1>Inicio</h1>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return{
        props: {}
    }
})