'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
const REGISTER_STORAGE_KEY = 'storiesv13.register.form';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REGISTER_STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        username?: string;
        email?: string;
        verificationCode?: string;
      };
      setUsername(parsed.username ?? '');
      setEmail(parsed.email ?? '');
      setVerificationCode(parsed.verificationCode ?? '');
    } catch {
      localStorage.removeItem(REGISTER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ username, email, verificationCode });
    localStorage.setItem(REGISTER_STORAGE_KEY, payload);
  }, [username, email, verificationCode]);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return false;
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasLower || !hasUpper || !hasNumber || !hasSymbol) {
      setError('La contrasena debe incluir mayuscula, minuscula, numero y simbolo.');
      return false;
    }

    return true;
  };

  const ensurePasswordsMatch = () => {
    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    setMensaje(null);
    setError(null);

    if (!username.trim()) {
      setError('El nombre de usuario es obligatorio.');
      return;
    }

    if (!email.trim()) {
      setError('El correo es obligatorio.');
      return;
    }

    if (!password) {
      setError('La contrasena es obligatoria.');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    if (!ensurePasswordsMatch()) {
      return;
    }

    setEnviandoCodigo(true);
    try {
      const respuesta = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo enviar el codigo.');
      }

      setCodigoEnviado(true);
      setMensaje(data?.mensaje ?? 'Codigo enviado. Revisa tu correo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setEnviandoCodigo(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje(null);
    setError(null);

    if (!codigoEnviado) {
      setError('Primero envia el codigo de verificacion.');
      return;
    }

    if (!verificationCode.trim()) {
      setError('Ingresa el codigo de verificacion.');
      return;
    }

    setRegistrando(true);
    try {
      const respuesta = await fetch(`${API_BASE}/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo completar el registro.');
      }

      setMensaje(data?.mensaje ?? 'Registro confirmado. Ya puedes iniciar sesion.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setCodigoEnviado(false);
      localStorage.removeItem(REGISTER_STORAGE_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <section style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
      <h1 style={{ marginTop: 0 }}>Registro</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Completa tu registro y confirma el codigo de verificacion desde el mismo formulario.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Nombre de usuario</span>
          <input
            type="text"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Correo</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={enviandoCodigo}
              style={{
                padding: '0 1rem',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 600,
                background: enviandoCodigo ? '#475569' : '#38bdf8',
                color: '#0f172a',
                cursor: enviandoCodigo ? 'not-allowed' : 'pointer',
              }}
            >
              {enviandoCodigo ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Contrasena</span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
            title="Minimo 8 caracteres, con mayuscula, minuscula, numero y simbolo."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Confirmar contrasena</span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
            title="Minimo 8 caracteres, con mayuscula, minuscula, numero y simbolo."
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          <span>Ver contrasenas</span>
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Codigo de verificacion</span>
          <input
            type="text"
            required
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}
          />
        </label>
        <button
          type="submit"
          disabled={registrando}
          style={{
            padding: '0.75rem',
            borderRadius: '999px',
            border: 'none',
            fontWeight: 600,
            background: registrando ? '#475569' : '#22c55e',
            color: '#0f172a',
            cursor: registrando ? 'not-allowed' : 'pointer',
          }}
        >
          {registrando ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '1rem', color: '#4ade80' }}>{mensaje}</p>}
      {error && <p style={{ marginTop: '1rem', color: '#f87171' }}>{error}</p>}
    </section>
  );
}
