'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const showVerifyLink = Boolean(error && /verif/i.test(error));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje(null);
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo iniciar sesión.');
      }

      setMensaje(data?.mensaje ?? 'Inicio de sesión exitoso.');
      router.push('/stories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Inicia sesión con tu correo y contraseña. Debes haber verificado el correo previamente.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Contraseña</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: '0.75rem',
            borderRadius: '999px',
            border: 'none',
            fontWeight: 600,
            background: cargando ? '#475569' : '#38bdf8',
            color: '#0f172a',
            cursor: cargando ? 'not-allowed' : 'pointer',
          }}
        >
          {cargando ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '1rem', color: '#4ade80' }}>{mensaje}</p>}
      {error && (
        <p style={{ marginTop: '1rem', color: '#f87171' }}>
          {error}{' '}
          {showVerifyLink && (
            <Link
              href="/auth/verify"
              style={{ color: '#38bdf8', textDecoration: 'underline' }}
            >
              Verificar correo
            </Link>
          )}
        </p>
      )}
    </section>
  );
}
