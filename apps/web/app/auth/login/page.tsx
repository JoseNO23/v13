'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
const LOGIN_EMAILS_KEY = 'storiesv13.login.emails';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const showVerifyLink = Boolean(error && /verif/i.test(error));
  const [emailHistory, setEmailHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(LOGIN_EMAILS_KEY);
      if (savedEmails) setEmailHistory(JSON.parse(savedEmails));
    } catch {
      localStorage.removeItem(LOGIN_EMAILS_KEY);
    }
  }, []);

  const storeRecentEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...emailHistory.filter((item) => item !== trimmed)].slice(0, 6);
    setEmailHistory(next);
    localStorage.setItem(LOGIN_EMAILS_KEY, JSON.stringify(next));
  };

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
      storeRecentEmail(email);
      router.push('/stories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full max-w-7xl mx-auto p-6">
        <section className="max-w-[460px] mx-auto">
          {/* Header estilo Stories */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-600/10 rounded-lg border border-pink-600/20 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-pink-500 tracking-wider uppercase">
                Viernes13
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-7 h-7 text-pink-500" />
              <h1 className="text-3xl font-black text-white">Login</h1>
            </div>
            <p className="text-sm text-gray-400">
              Inicia sesión con tu correo y contraseña. Debes haber verificado el correo previamente.
            </p>
          </div>

          {/* Card estilo Stories */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Email */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Correo</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    list="login-emails"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                               text-white text-sm placeholder:text-gray-600 transition-all outline-none
                               hover:border-white/20 focus:border-violet-500/50"
                    placeholder="tu-correo@dominio.com"
                  />
                </div>
              </label>
              <datalist id="login-emails">
                {emailHistory.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              {/* Password */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Contraseña</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                               text-white text-sm placeholder:text-gray-600 transition-all outline-none
                               hover:border-white/20 focus:border-violet-500/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((state) => !state)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {/* Button */}
              <button
                type="submit"
                disabled={cargando}
                className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all inline-flex items-center justify-center
                ${
                  cargando
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 to-pink-500 hover:-translate-y-0.5'
                }`}
              >
                {cargando ? 'Conectando...' : 'Entrar'}
              </button>

              {/* Links */}
              <div className="flex items-center justify-between pt-2">
                <Link href="/auth/register" className="text-xs text-gray-400 hover:text-gray-200 underline">
                  Crear cuenta
                </Link>
                {showVerifyLink && (
                  <Link href="/auth/verify" className="text-xs text-pink-400 hover:text-pink-300 underline">
                    Verificar correo
                  </Link>
                )}
              </div>
            </form>

            {/* Alerts */}
            {mensaje && (
              <p className="mt-4 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                {mensaje}
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
