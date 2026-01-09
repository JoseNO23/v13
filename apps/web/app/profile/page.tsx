'use client';

import { useEffect, useState } from 'react';
import {
  User, Mail, Globe, MessageSquare, Twitter, Instagram, Calendar,
  Clock, Shield, Eye, Settings, Edit, Check, X, ExternalLink,
  BookOpen, Heart, Users, TrendingUp, Award
} from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '');

type Privacy = {
  profileVisibility: string;
  showBio: boolean;
  showWebsite: boolean;
  showDiscord: boolean;
  showTwitter: boolean;
  showInstagram: boolean;
  showEmail: boolean;
  showCreatedAt: boolean;
  showFavorites: boolean;
  showStats: boolean;
  showLastSeen: boolean;
  allowDMs: boolean;
};

type Me = {
  id: string;
  email: string;
  role: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarKey: string | null;
  bannerKey: string | null;
  websiteUrl: string | null;
  discordTag: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  language: string | null;
  theme: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  privacy: Privacy;
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(date);
};

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Propietario', color: 'from-pink-600 to-rose-600' },
  SUPER_ADMIN: { label: 'Admin Senior', color: 'from-violet-600 to-purple-600' },
  ADMIN: { label: 'Admin', color: 'from-blue-600 to-cyan-600' },
  MODERATOR: { label: 'Moderador', color: 'from-emerald-600 to-green-600' },
  CREATOR: { label: 'Creador', color: 'from-amber-600 to-yellow-600' },
  USER: { label: 'Usuario', color: 'from-gray-600 to-gray-500' },
};

const GENRES = [
  'Sobrenatural',
  'Psicológico',
  'Slasher',
  'Gore',
  'Paranormal',
  'Gótico',
  'Lovecraftiano',
  'Apocalíptico',
  'Distópico',
  'Cósmico',
  'Demoníaco',
  'Oculto',
  'Ritualista',
  'Folclórico',
  'Maldito',
  'Macabro',
  'Siniestral',
  'Grotesco',
  'Trágico',
  'Fatalista',
  'Nihilista',
  'Enigmático',
  'Suspense',
  'Conspirativo',
  'Sectario',
  'Científico',
  'Tecnológico',
  'Biológico',
  'Experimental',
  'Realista',
];

const GROUPS = [
  'Criaturas',
  'Personajes',
  'Lugares',
  'Objetos',
  'Fenómenos',
  'Rituales',
  'Psicología',
  'Social',
  'Atmósferas',
  'Ambientación',
  'Formato',
  'Advertencias',
];

const CATEGORIES = [
  'Banshee',
  'Vampiros',
  'Licántropos',
  'Brujas',
  'Demonios',
  'Espectros',
  'Zombis',
  'Momias',
  'Esqueletos',
  'Reptilianos',
  'Niños oscuros',
  'Anciano maldito',
  'Mendigo profeta',
  'Investigador obsesivo',
  'Sacerdote caído',
  'Médium',
  'Gemelo perdido',
  'Vecino sospechoso',
  'Testigo silencioso',
  'Líder de culto',
  'Casa embrujada',
  'Mansión maldita',
  'Hotel maldito',
  'Hospital abandonado',
  'Escuela abandonada',
  'Metro fantasma',
  'Pueblo fantasma',
  'Cementerio',
  'Catacumbas',
  'Bosque oscuro',
  'Anillo maldito',
  'Reloj parado',
  'Vestido de novia',
  'Crucifijo invertido',
  'Muñeca poseída',
  'Libro maldito',
  'Retrato maldito',
  'Llave antigua',
  'Caja sellada',
  'Máscara ritual',
  'Posesión',
  'Apariciones',
  'Poltergeist',
  'Telequinesis',
  'Levitación',
  'Materialización',
  'Parálisis del sueño',
  'Bucle temporal',
  'Deja vu',
  'Voz en la pared',
  'Invocación',
  'Sacrificio',
  'Exorcismo',
  'Pacto oscuro',
  'Círculo de sal',
  'Ouija',
  'Tarot',
  'Grimorio',
  'Alquimia oscura',
  'Necromancia',
  'Delirio',
  'Disociación',
  'Paranoia',
  'Amnesia',
  'Trauma',
  'Culpa',
  'Obsesión',
  'Alucinaciones',
  'Identidad rota',
  'Narrador poco fiable',
  'Manipulación psicológica',
  'Gaslighting',
  'Lavado cerebral',
  'Vigilancia',
  'Conspiración',
  'Tráfico humano',
  'Secuestro',
  'Captividad',
  'Acecho',
  'Justicia torcida',
  'Niebla espesa',
  'Eclipse',
  'Luna sangrienta',
  'Solsticio',
  'Apagón',
  'Lluvia eterna',
  'Silencio total',
  'Estática',
  'Interferencias',
  'Señal perdida',
  'Suburbio olvidado',
  'Ciudad en ruinas',
  'Carretera nocturna',
  'Cabaña aislada',
  'Isla maldita',
  'Barco fantasma',
  'Faro solitario',
  'Mina abandonada',
  'Túneles',
  'Sótano',
  'Diario en primera persona',
  'Cartas',
  'Expediente',
  'Informe forense',
  'Podcast',
  'Transmisión en vivo',
  'Chat encontrado',
  'Grabación recuperada',
  'Cinta VHS',
  'Foto maldita',
  'Contenido sensible',
  'Violencia explícita',
  'Sangre',
  'Tortura',
  'Mutilación',
  'Canibalismo',
  'Autolesión',
  'Suicidio',
  'Lenguaje explícito',
  'Contenido sexual (+18)',
];

export default function ProfilePage() {
  const [data, setData] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/users/me`, { credentials: 'include' });
        if (!response.ok) throw new Error('No se pudo cargar el perfil.');
        const json = (await response.json()) as Me;
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Error inesperado.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-gray-400">Cargando perfil...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-300">
          {error || 'No se encontró el perfil'}
        </div>
      </div>
    );
  }

  const roleBadge = ROLE_BADGES[data.role] || ROLE_BADGES.USER;

  // Mock stats - reemplaza con datos reales
  const stats = {
    stories: 12,
    followers: 456,
    following: 89,
    likes: 1234,
  };

  return (
    <div className="w-full min-h-screen bg-transparent pb-12">
      {/* Banner Section */}
      <div className="relative h-64 overflow-hidden">
        {/* Banner Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-violet-600/20 to-purple-600/20">
          {data.bannerKey ? (
            <img src={data.bannerKey} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-delayed" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-transparent" />

        {/* Edit Banner Button */}
        <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-black/70 transition-colors">
          <Edit className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl border-4 border-[#08080b] bg-gradient-to-br from-pink-600 via-violet-600 to-purple-600 p-1 shadow-2xl">
              {data.avatarKey ? (
                <img src={data.avatarKey} alt={data.username} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-xl bg-[#0f0f18] flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-lg">
              <Edit className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-white">
                    {data.displayName || data.username}
                  </h1>
                  {data.emailVerifiedAt && (
                    <div className="p-1 bg-emerald-500/10 rounded-lg" title="Verificado">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400">@{data.username}</span>
                  <span className="text-gray-600">•</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>

              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 hidden sm:inline">Editar perfil</span>
              </button>
            </div>

            {/* Bio */}
            {data.bio && (
              <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
                {data.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {data.websiteUrl && (
                <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Sitio web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {data.discordTag && (
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.discordTag}</span>
                </div>
              )}
              {data.twitterUrl && (
                <a href={data.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
              {data.instagramUrl && (
                <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Miembro desde {formatDate(data.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Historias', value: stats.stories, color: 'pink' },
            { icon: Users, label: 'Seguidores', value: stats.followers, color: 'violet' },
            { icon: Heart, label: 'Siguiendo', value: stats.following, color: 'cyan' },
            { icon: TrendingUp, label: 'Me gusta', value: stats.likes, color: 'emerald' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.06] transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500 group-hover:scale-110 transition-transform`} />
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-600/10 rounded-lg">
                  <User className="w-5 h-5 text-pink-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Acerca de</h2>
              </div>

              <div className="grid gap-3">
                {[
                  { icon: Mail, label: 'Email', value: data.privacy.showEmail ? data.email : 'Oculto', visible: data.privacy.showEmail },
                  { icon: Globe, label: 'Idioma', value: data.language || 'No especificado', visible: true },
                  { icon: Clock, label: 'Última conexión', value: data.privacy.showLastSeen ? formatDate(data.lastLoginAt) : 'Oculto', visible: data.privacy.showLastSeen },
                  { icon: Shield, label: 'Perfil', value: data.privacy.profileVisibility, visible: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${item.visible ? 'text-white' : 'text-gray-600'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements / Badges */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-600/10 rounded-lg">
                  <Award className="w-5 h-5 text-violet-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Logros</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Primera historia', desc: 'Publicaste tu primer relato', color: 'pink' },
                  { name: 'Escritor activo', desc: '10+ historias publicadas', color: 'violet' },
                  { name: 'Popular', desc: '100+ seguidores', color: 'cyan' },
                ].map((badge, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${badge.color}-600/20 to-${badge.color}-600/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Award className={`w-6 h-6 text-${badge.color}-500`} />
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Settings Preview */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-600/10 rounded-lg">
                  <Eye className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Privacidad</h2>
              </div>

              <div className="space-y-2">
                {Object.entries(data.privacy).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )
                    ) : (
                      <span className="text-gray-500">{String(value)}</span>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                Ver toda la configuración →
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-600/10 rounded-lg">
                  <Clock className="w-5 h-5 text-cyan-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Actividad reciente</h2>
              </div>

              <div className="space-y-3 text-xs text-gray-400">
                <div className="flex gap-3">
                  <div className="w-1 bg-pink-600 rounded-full" />
                  <div>
                    <div className="text-white mb-1">Publicaste una historia</div>
                    <div>Hace 2 horas</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-violet-600 rounded-full" />
                  <div>
                    <div className="text-white mb-1">Nuevo seguidor</div>
                    <div>Hace 5 horas</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-cyan-600 rounded-full" />
                  <div>
                    <div className="text-white mb-1">Comentario en tu historia</div>
                    <div>Hace 1 día</div>
                  </div>
                </div>
              </div>
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
