'use client';

import { FormEvent, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje(null);
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_BASE}/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo verificar el correo.');
      }

      setMensaje(data?.mensaje ?? 'Correo verificado correctamente.');
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
      <h1 style={{ marginTop: 0 }}>Verificar correo</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Ingresa el correo y el codigo de 6 digitos que recibiste para verificar tu cuenta.
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
          <span>Codigo</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
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
          {cargando ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '1rem', color: '#4ade80' }}>{mensaje}</p>}
      {error && <p style={{ marginTop: '1rem', color: '#f87171' }}>{error}</p>}
    </section>
  );
}

