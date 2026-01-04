'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

type AuthState = 'loading' | 'authed' | 'guest';

export default function MainNav({ logoUrl }: { logoUrl: string | null }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const refreshAuth = useCallback(() => {
    let mounted = true;

    const loadSession = async () => {
      if (mounted) setAuthState('loading');
      try {
        const response = await fetch(`${API_BASE}/users/me`, { credentials: 'include' });
        if (!mounted) return;
        setAuthState(response.ok ? 'authed' : 'guest');
      } catch {
        if (!mounted) return;
        setAuthState('guest');
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const cleanup = refreshAuth();
    return cleanup;
  }, [refreshAuth, pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } finally {
      setAuthState('guest');
      setMenuOpen(false);
      router.push('/');
    }
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {logoUrl ? <Image src={logoUrl} alt="Viernes13" width={140} height={48} priority /> : null}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: 'auto' }}>
        {authState === 'guest' ? (
          <>
            <Link href="/auth/register">Registro</Link>
            <Link href="/auth/login">Login</Link>
          </>
        ) : null}
        {authState === 'authed' ? (
          <Link href="/stories">Historias</Link>
        ) : null}
      </div>
      {authState === 'authed' ? (
        <div style={{ position: 'relative', marginLeft: '2rem' }}>
          <button
            type="button"
            aria-label="Abrir menu"
            title="Menu"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {menuOpen ? (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 0.5rem)',
                minWidth: '180px',
                background: 'rgba(10, 10, 12, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.5rem',
                display: 'grid',
                gap: '0.25rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
                zIndex: 40,
              }}
            >
              <Link href="/profile" style={{ padding: '0.5rem 0.65rem' }}>
                Perfil
              </Link>
              <Link href="/stories" style={{ padding: '0.5rem 0.65rem' }}>
                Historias
              </Link>
              <Link href="/settings" style={{ padding: '0.5rem 0.65rem' }}>
                Configuracion
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.65rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Cerrar sesion
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
