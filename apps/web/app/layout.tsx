import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'storiesV13 · Auth',
  description: 'Panel mínimo de autenticación storiesV13',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const authToken = cookies().get('auth_token')?.value;
  return (
    <html lang="es">
      <body>
        <header style={{ padding: '1rem 2rem' }}>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontWeight: 700 }}>storiesV13</span>
            {!authToken && (
              <>
                <a href="/auth/register">Registro</a>
                <a href="/auth/login">Login</a>
              </>
            )}
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem' }}>
          Backend: http://localhost:4000
        </footer>
      </body>
    </html>
  );
}
