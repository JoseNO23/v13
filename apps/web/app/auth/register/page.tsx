'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
const REGISTER_EMAILS_KEY = 'storiesv13.register.emails';
const REGISTER_USERNAMES_KEY = 'storiesv13.register.usernames';

export default function RegisterPage() {
  const router = useRouter();
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

  const [emailHistory, setEmailHistory] = useState<string[]>([]);
  const [usernameHistory, setUsernameHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(REGISTER_EMAILS_KEY);
      const savedUsernames = localStorage.getItem(REGISTER_USERNAMES_KEY);
      if (savedEmails) setEmailHistory(JSON.parse(savedEmails));
      if (savedUsernames) setUsernameHistory(JSON.parse(savedUsernames));
    } catch {
      localStorage.removeItem(REGISTER_EMAILS_KEY);
      localStorage.removeItem(REGISTER_USERNAMES_KEY);
    }
  }, []);

  const storeRecentValue = (
    key: string,
    value: string,
    setter: (values: string[]) => void,
    current: string[],
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, 6);
    setter(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasLower || !hasUpper || !hasNumber || !hasSymbol) {
      setError('La contraseña debe incluir mayúscula, minúscula, número y símbolo.');
      return false;
    }

    return true;
  };

  const ensurePasswordsMatch = () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    setMensaje(null);
    setError(null);

    if (!username.trim()) return setError('El nombre de usuario es obligatorio.');
    if (!email.trim()) return setError('El correo es obligatorio.');
    if (!password) return setError('La contraseña es obligatoria.');
    if (!validatePassword()) return;
    if (!ensurePasswordsMatch()) return;

    setEnviandoCodigo(true);
    try {
      const respuesta = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo enviar el código.');
      }

      storeRecentValue(REGISTER_EMAILS_KEY, email, setEmailHistory, emailHistory);
      storeRecentValue(REGISTER_USERNAMES_KEY, username, setUsernameHistory, usernameHistory);

      setCodigoEnviado(true);
      setMensaje(data?.mensaje ?? 'Código enviado. Revisa tu correo.');
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
      setError('Primero envía el código de verificación.');
      return;
    }

    const trimmedCode = verificationCode.trim().replace(/\s+/g, '');
    if (!trimmedCode) {
      setError('Ingresa el código de verificación.');
      return;
    }

    setRegistrando(true);
    try {
      const respuesta = await fetch(`${API_BASE}/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: trimmedCode }),
      });

      const data = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(data?.message ?? data?.mensaje ?? 'No se pudo completar el registro.');
      }

      setMensaje(data?.mensaje ?? 'Registro confirmado. Ya puedes iniciar sesión.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setCodigoEnviado(false);

      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full max-w-7xl mx-auto p-6">
        <section className="max-w-[520px] mx-auto">
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
              <h1 className="text-3xl font-black text-white">Registro</h1>
            </div>
            <p className="text-sm text-gray-400">
              Completa tu registro y confirma el código de verificación desde el mismo formulario.
            </p>
          </div>

          {/* Card estilo Stories */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Username */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Nombre de usuario</span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    list="register-usernames"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                               text-white text-sm placeholder:text-gray-600 transition-all outline-none
                               hover:border-white/20 focus:border-violet-500/50"
                    placeholder="tu-usuario"
                  />
                </div>
              </label>
              <datalist id="register-usernames">
                {usernameHistory.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              {/* Email + Send code */}
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Correo</span>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      list="register-emails"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                                 text-white text-sm placeholder:text-gray-600 transition-all outline-none
                                 hover:border-white/20 focus:border-violet-500/50"
                      placeholder="tu-correo@dominio.com"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={enviandoCodigo}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                    ${
                      enviandoCodigo
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:-translate-y-0.5'
                    }`}
                  >
                    {enviandoCodigo ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>

                <datalist id="register-emails">
                  {emailHistory.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>

                {codigoEnviado && (
                  <p className="text-[11px] text-emerald-300">
                    Código enviado. Revisa tu correo (si cae en spam, márcalo como “No es spam”).
                  </p>
                )}
              </div>

              {/* Password */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Contraseña</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
                    title="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo."
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                               text-white text-sm placeholder:text-gray-600 transition-all outline-none
                               hover:border-white/20 focus:border-violet-500/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {/* Confirm password */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Confirmar contraseña</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
                    title="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo."
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                               text-white text-sm placeholder:text-gray-600 transition-all outline-none
                               hover:border-white/20 focus:border-violet-500/50"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {/* Verification code */}
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-gray-300">Código de verificación</span>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\s+/g, ''))}
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                             text-white text-sm placeholder:text-gray-600 transition-all outline-none
                             hover:border-white/20 focus:border-violet-500/50"
                  placeholder="Ej: 123456"
                />
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={registrando}
                className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all inline-flex items-center justify-center
                ${
                  registrando
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 to-pink-500 hover:-translate-y-0.5'
                }`}
              >
                {registrando ? 'Registrando...' : 'Registrar'}
              </button>

              {/* Links */}
              <div className="flex items-center justify-between pt-2">
                <Link href="/auth/login" className="text-xs text-gray-400 hover:text-gray-200 underline">
                  Ya tengo cuenta
                </Link>
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
