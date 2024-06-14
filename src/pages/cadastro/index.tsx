import { FormEvent, useState, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";
import logo from "../../../public/logonossabiblioteca.svg";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../services/apiClient";
import { UserHeader } from "../../components/UserHeader";
import selectCourseStyle from "../cadastro/styles.module.scss";
import Footer from "../../components/Footer";

export default function Register() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  async function getCourses() {
    try {
      const response = await api.get("/course");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter os cursos:", error);
      throw error;
    }
  }

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Erro ao buscar os cursos:", error);
      }
    }

    fetchCourses();
  }, []);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (name === "" || email === "" || password === "" || selectedCourse === "") {
      toast.error("Preencha os dados corretamente");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
      courseId: parseInt(selectedCourse),
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>NossaBiblioteca - Cadastro</title>
      </Head>
      <UserHeader />
      <div className={styles.containerCenter}>
        <Image src={logo} alt="Logo Biblioteca" />

        <div className={styles.login}>
          <h1>Criar uma conta</h1>

          <form onSubmit={handleRegister}>
            <Input placeholder="Digite seu nome" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Digite seu email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Digite sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select className={selectCourseStyle.selectCourse} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <Button type="submit" loading={loading}>
              Prosseguir
            </Button>
          </form>

          <Link href="/" className={styles.text}>
            Já possuo conta
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
