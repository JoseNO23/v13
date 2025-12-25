'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthNav() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthed(Boolean(token));
  }, []);

  if (isAuthed) {
    return null;
  }

  return (
    <>
      <Link href="/auth/register">Registro</Link>
      <Link href="/auth/login">Login</Link>
    </>
  );
}
