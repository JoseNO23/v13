'use client';

import { BookOpen, Sparkles, TrendingUp, Users, Zap, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: BookOpen,
      title: 'Crea historias',
      description: 'Escribe y publica tus relatos de terror, misterio y suspenso',
      color: 'pink',
    },
    {
      icon: Users,
      title: 'Comunidad activa',
      description: 'Conecta con otros escritores y lectores apasionados',
      color: 'violet',
    },
    {
      icon: Sparkles,
      title: 'Descubre contenido',
      description: 'Explora miles de historias de la comunidad',
      color: 'cyan',
    },
  ];

  const stats = [
    { value: '1.2K+', label: 'Historias' },
    { value: '500+', label: 'Escritores' },
    { value: '5K+', label: 'Lectores' },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Hero Section */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 mb-6 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-pulse-delayed" />
          </div>

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600/10 rounded-xl border border-pink-600/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
              <span className="font-mono text-xs font-bold text-pink-500 tracking-wider uppercase">
                Viernes13
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              Tu plataforma de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500">
                historias de terror
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
              Únete a la comunidad de escritores y lectores más grande de relatos oscuros.
              Comparte tus pesadillas y descubre las de otros.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/auth/register"
                className="group px-8 py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 rounded-2xl text-white font-bold text-sm
                         transition-all duration-300 shadow-[0_20px_40px_rgba(255,42,109,0.3)]
                         hover:shadow-[0_25px_50px_rgba(255,42,109,0.4)] hover:-translate-y-1
                         flex items-center gap-3 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Comenzar gratis</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm
                         transition-all duration-300 hover:bg-white/10 hover:border-white/20
                         flex items-center gap-3"
              >
                <span>Iniciar sesión</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer
                ${hoveredFeature === idx ? 'bg-white/[0.06] border-white/20 -translate-y-1' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
                ${feature.color === 'pink' ? 'bg-pink-600/10' : feature.color === 'violet' ? 'bg-violet-600/10' : 'bg-cyan-600/10'}
                ${hoveredFeature === idx ? 'scale-110' : ''}`}
              >
                <feature.icon className={`w-6 h-6
                  ${feature.color === 'pink' ? 'text-pink-500' : feature.color === 'violet' ? 'text-violet-500' : 'text-cyan-500'}`}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-600/10 rounded-lg">
                <Zap className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-lg font-bold text-white">¿Qué es Viernes13?</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Una plataforma diseñada para escritores y lectores de historias de terror, misterio y suspenso.
              Publica tus relatos, recibe feedback de la comunidad y descubre nuevas pesadillas cada día.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Terror', 'Misterio', 'Suspenso', 'Paranormal'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-600/10 rounded-lg">
                <Play className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Cómo empezar</h3>
            </div>
            <div className="space-y-3">
              {[
                'Crea tu cuenta gratis en segundos',
                'Verifica tu correo electrónico',
                'Completa tu perfil de escritor',
                'Publica tu primera historia',
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-gray-400 pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }

        @keyframes pulse-delayed {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.4; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-pulse-delayed {
          animation: pulse-delayed 10s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
}
