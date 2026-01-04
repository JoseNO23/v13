import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import VHSGlobal from './effects/vhs-global';
import VHSDefs from './effects/vhs-defs';
import { VHS_GLOBAL_FILTER_REF } from './effects/vhs-constants';
import ThemeClient from './components/theme-client';
import MainNav from './components/main-nav';

export const metadata: Metadata = {
  title: 'storiesV13 · Auth',
  description: 'Panel mínimo de autenticación storiesV13',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const getBranding = async () => {
  try {
    const response = await fetch(`${API_BASE}/public/branding`, { cache: 'no-store' });
    if (!response.ok) {
      return { logoUrl: null as string | null };
    }
    return (await response.json()) as { logoUrl: string | null };
  } catch {
    return { logoUrl: null as string | null };
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { logoUrl } = await getBranding();
  return (
    <html lang="es">
      <body>
        <ThemeClient />
        <VHSDefs />
        <VHSGlobal />
        <div className="vhs-static" aria-hidden="true">
          <div className="vhs-static-noise" />
          <div className="vhs-static-scan" />
          <div className="vhs-static-vignette" />
        </div>
        <div
          className="vhs-surface vhs-safe-area"
          style={{ filter: `${VHS_GLOBAL_FILTER_REF} blur(var(--page-blur, 0px))` }}
        >
          <header className="site-header">
            <MainNav logoUrl={logoUrl} />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
