import Link from 'next/link';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-pink-300">
          Error 404
        </div>
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
          <Ghost className="h-10 w-10 text-pink-400" />
        </div>
        <h1 className="mb-3 text-4xl font-black text-white">Esta historia no existe</h1>
        <p className="mb-8 max-w-xl text-sm text-gray-400">
          Te perdiste en los pasillos. La página que buscas no está disponible o nunca existió.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver historias
          </Link>
        </div>
      </div>
    </div>
  );
}
