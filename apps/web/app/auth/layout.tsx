import type { ReactNode } from 'react';

export const metadata = {
  title: 'storiesV13 Auth',
  description: 'Autenticacion por correo',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
