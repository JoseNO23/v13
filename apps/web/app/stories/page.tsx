'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Clock, Filter, Plus, Search, Sparkles, TrendingUp, Star, Eye } from 'lucide-react';

type Story = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  views: number;
  chapters: number;
  lastUpdate: string;
  category: string;
  image: string;
};

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'recientes', label: 'Recientes' },
  { id: 'populares', label: 'Populares' },
  { id: 'favoritas', label: 'Favoritas' },
];

const R2_BASE_URL = 'https://pub-0267235b0cfa4dfba8a0de922e29b0db.r2.dev';

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [stories] = useState<Story[]>([]);

  const filteredStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesQuery =
        !query ||
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query);
      return matchesQuery;
    });
  }, [searchQuery, stories]);

  const stats = useMemo(
    () => ({
      total: stories.length,
      newToday: 0,
      activeReads: 0,
    }),
    [stories.length],
  );

  const resolveImageUrl = (value: string) => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `${R2_BASE_URL}/${value}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08080b] via-[#0a0a12] to-[#12091a] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-25">
          <div className="absolute top-[20%] right-[15%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[15%] left-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] animate-float-delayed" />
          <div className="absolute top-[60%] right-[40%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[90px] animate-float-slow" />
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 relative">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="space-y-4">
              {/* Logo Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600/10 to-violet-600/10 rounded-xl border border-pink-600/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
                <span className="font-mono text-xs font-bold text-pink-500 tracking-wider uppercase">
                  Viernes13
                </span>
              </div>

              {/* Title Section */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-600/20 to-violet-600/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <BookOpen className="w-8 h-8 text-pink-500" />
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                    Historias
                  </h1>
                  <p className="text-gray-400 mt-1 text-sm">Descubre mundos increíbles creados por la comunidad</p>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 rounded-2xl text-white font-bold text-sm
                         transition-all duration-300 shadow-[0_20px_40px_rgba(255,42,109,0.3)]
                         hover:shadow-[0_25px_50px_rgba(255,42,109,0.4)] hover:-translate-y-1 hover:scale-105
                         flex items-center gap-3 overflow-hidden"
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Nueva historia</span>
            </button>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Enhanced Search Bar */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[#0f0f18]/60 backdrop-blur-xl border-[1.5px] border-white/10 rounded-2xl
                           text-white text-sm placeholder:text-gray-600 transition-all duration-300 outline-none
                           hover:bg-[#0f0f18]/80 hover:border-white/20
                           focus:bg-[#0f0f18]/90 focus:border-violet-500/50 focus:shadow-[0_0_0_4px_rgba(138,92,246,0.15)]"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm text-gray-400 border border-white/10 whitespace-nowrap">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Filtros</span>
              </div>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${
                      activeFilter === filter.id
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_10px_30px_rgba(138,92,246,0.4)] scale-105'
                        : 'bg-white/[0.03] backdrop-blur-sm text-gray-400 border border-white/10 hover:bg-white/[0.06] hover:text-gray-300 hover:border-white/20'
                    }`}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            { icon: TrendingUp, value: stats.total, label: 'Historias totales', color: 'pink', gradient: 'from-pink-600/10 to-rose-600/10' },
            { icon: Clock, value: stats.newToday, label: 'Nuevas hoy', color: 'violet', gradient: 'from-violet-600/10 to-purple-600/10' },
            { icon: Sparkles, value: stats.activeReads, label: 'Lecturas activas', color: 'cyan', gradient: 'from-cyan-600/10 to-blue-600/10' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-[#0f0f18]/50 to-[#0f0f18]/30 backdrop-blur-xl border border-white/10
                       rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden
                       hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative flex items-center gap-4">
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-0.5">{stat.value.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group relative bg-gradient-to-br from-[#0f0f18]/60 to-[#0f0f18]/40 backdrop-blur-xl border border-white/10
                       rounded-3xl overflow-hidden hover:border-violet-500/50 transition-all duration-500 cursor-pointer
                       hover:shadow-[0_30px_80px_rgba(138,92,246,0.25)] hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-600/10 via-violet-600/10 to-purple-600/10">
                <img
                  src={resolveImageUrl(story.image)}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-transparent opacity-60" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 text-xs font-bold text-white shadow-lg">
                  {story.category}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
                  {story.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {story.excerpt}
                </p>

                {/* Meta Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-4 h-4 text-violet-500" />
                      {story.chapters}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Eye className="w-4 h-4 text-pink-500" />
                      {story.views.toLocaleString()}
                    </span>
                  </div>
                  <Star className="w-4 h-4 text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer" />
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 via-violet-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {story.author[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-200 truncate">{story.author}</div>
                    <div className="text-xs text-gray-500">{story.lastUpdate}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-32">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-violet-600/20 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#0f0f18] to-[#1a1a2e] border border-white/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-600" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-3">No hay historias disponibles</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Sé el primero en crear una historia increíble y compartirla con la comunidad
            </p>
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 rounded-2xl text-white font-bold text-sm
                         transition-all duration-300 shadow-[0_20px_40px_rgba(255,42,109,0.3)]
                         hover:shadow-[0_25px_50px_rgba(255,42,109,0.4)] hover:-translate-y-1
                         inline-flex items-center gap-3"
              type="button"
            >
              <Plus className="w-5 h-5" />
              Crear mi primera historia
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.05); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 30s ease-in-out infinite; }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
