// pages/contact.tsx

import React, { useState } from 'react';
import { UserHeader } from '../../components/UserHeader';
import Footer from '../../components/Footer';
import styles from './styles.module.scss';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        suggestion,
      }),
    });

    if (response.ok) {
      alert('Sugestão enviada com sucesso!');
      setName('');
      setEmail('');
      setSuggestion('');
    } else {
      alert('Erro ao enviar sugestão, tente novamente.');
    }
  };

  return (
    <>
      <UserHeader />
      <div className={styles.container}>
        <h1>Contato</h1>
        <p>Entre em contato conosco para sugerir novos livros para nosso acervo.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Nome:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Sugestão de Livro:
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            ></textarea>
          </label>
          <button type="submit">Enviar</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
