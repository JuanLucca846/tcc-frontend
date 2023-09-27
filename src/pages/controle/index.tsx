import { ChangeEvent, useState } from 'react'
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";

export default function adminControl(){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e: ChangeEvent<HTMLInputElement>){

        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }

    }

    return(
        <>
        <Head>
        <title>NossaBiblioteca - Adicionar livros</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>Cadastrar livro</h1>

                <form className={styles.form}>

                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload size={25} color="#109152"/>
                        </span>

                        <input type="file" accept="imagem/png, imagem/jpeg" onChange={handleFile}/>

                        {avatarUrl && (
                            <img
                            className={styles.preview}
                            src={avatarUrl}
                            alt="Foto do produto"
                            width={250}
                            height={250}
                            />
                        )}

                    </label>

                    <input 
                    type="text"
                    placeholder="Digite o nome do livro"
                    className={styles.input}
                    />

                    <input 
                    type="text"
                    placeholder="Digite o nome do autor"
                    className={styles.input}
                    />

                    <input 
                    type="text"
                    placeholder="Digite o nome da categoria"
                    className={styles.input}
                    />

                    <input 
                    type="number"
                    placeholder="Digite a quantidade de livros"
                    className={styles.input}
                    />

                    <button 
                    type="submit"
                    className={styles.buttonAdd}>
                    Adicionar
                    </button>

                </form>
            </main>
            
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return{
        props: {}
    }
})