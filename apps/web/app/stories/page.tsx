'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { BookOpen, Clock, Filter, Plus, Search, Sparkles, TrendingUp, Star, Eye } from 'lucide-react';

type Story = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  views: number;
  chapters: number;
  lastUpdate: string;
  category?: string;
  genres?: string[];
  categories?: string[];
  image: string;
};

type TaxonomyGroup = {
  id: string;
  name: string;
  categories: { id: string; name: string }[];
};

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'recientes', label: 'Recientes' },
  { id: 'populares', label: 'Populares' },
  { id: 'favoritas', label: 'Favoritas' },
];

const API_BASE = 'http://localhost:4000';
const R2_BASE_URL = 'https://pub-0267235b0cfa4dfba8a0de922e29b0db.r2.dev';

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [groups, setGroups] = useState<TaxonomyGroup[]>([]);
  const [taxonomyLoading, setTaxonomyLoading] = useState(true);
  const [taxonomyError, setTaxonomyError] = useState<string | null>(null);
  const [stories] = useState<Story[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadTaxonomy = async () => {
      try {
        const response = await fetch(`${API_BASE}/taxonomy`);
        if (!response.ok) throw new Error('No se pudo cargar la taxonomía.');
        const json = (await response.json()) as { genres: { name: string }[]; groups: TaxonomyGroup[] };
        if (!mounted) return;
        setGenres(json.genres.map((genre) => genre.name));
        setGroups(json.groups);
      } catch (err) {
        if (!mounted) return;
        setTaxonomyError(err instanceof Error ? err.message : 'Error inesperado.');
      } finally {
        if (mounted) setTaxonomyLoading(false);
      }
    };

    loadTaxonomy();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      const storyGenres = story.genres ?? [];
      const storyCategories = story.categories ?? (story.category ? [story.category] : []);
      const matchesQuery =
        !query ||
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        storyCategories.some((category) => category.toLowerCase().includes(query)) ||
        storyGenres.some((genre) => genre.toLowerCase().includes(query));
      const matchesGenres =
        selectedGenres.length === 0 || selectedGenres.some((genre) => storyGenres.includes(genre));
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => storyCategories.includes(category));
      return matchesQuery && matchesGenres && matchesCategories;
    });
  }, [searchQuery, selectedCategories, selectedGenres, stories]);

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

  const toggleFilterValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedCategories([]);
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-600/10 rounded-lg border border-pink-600/20 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-pink-500 tracking-wider uppercase">
                  Viernes13
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-7 h-7 text-pink-500" />
                <h1 className="text-3xl font-black text-white">Historias</h1>
              </div>
              <p className="text-sm text-gray-400">Descubre mundos increíbles creados por la comunidad</p>
            </div>

            <button
              className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl text-white font-bold text-sm
                         transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Nueva historia
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por título, autor o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg
                         text-white text-sm placeholder:text-gray-600 transition-all outline-none
                         hover:border-white/20 focus:border-violet-500/50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                    ${
                      activeFilter === filter.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/[0.05] text-gray-400 border border-white/10 hover:bg-white/[0.08]'
                    }`}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/[0.05] text-gray-300 border border-white/10 hover:bg-white/[0.08]"
            >
              <Filter className="w-4 h-4 text-pink-400" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: TrendingUp, value: stats.total, label: 'Historias totales' },
            { icon: Clock, value: stats.newToday, label: 'Nuevas hoy' },
            { icon: Sparkles, value: stats.activeReads, label: 'Lecturas activas' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-pink-500" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-[10px] text-gray-400 uppercase font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStories.map((story) => {
              const storyGenres = story.genres ?? [];
              const storyCategories = story.categories ?? (story.category ? [story.category] : []);
              const categoryLabel = storyCategories[0] ?? 'Sin categoría';
              return (
                <div
                  key={story.id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden
                         hover:border-violet-500/50 transition-all cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-pink-600/10 to-violet-600/10">
                    <img
                      src={resolveImageUrl(story.image)}
                      alt={story.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-[10px] font-bold text-white">
                      {categoryLabel}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1 hover:text-pink-400 transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{story.excerpt}</p>

                    {(storyGenres.length > 0 || storyCategories.length > 0) && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {storyGenres.slice(0, 2).map((genre) => (
                          <span key={genre} className="px-2 py-0.5 rounded-full bg-pink-600/10 text-[10px] text-pink-300">
                            {genre}
                          </span>
                        ))}
                        {storyCategories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="px-2 py-0.5 rounded-full bg-violet-600/10 text-[10px] text-violet-300"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3 pb-3 border-b border-white/5">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {story.chapters}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {story.views.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                        {story.author[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-300 truncate">{story.author}</div>
                        <div className="text-[10px] text-gray-500">{story.lastUpdate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No hay historias disponibles</h3>
            <p className="text-sm text-gray-400 mb-6">Sé el primero en crear una historia increíble</p>
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl text-white font-bold text-sm
                         transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Crear mi primera historia
            </button>
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[10000]">
          <button
            type="button"
            aria-label="Cerrar filtros"
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0b12] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Filtros de historias</h2>
                <p className="text-xs text-gray-400">
                  Selecciona características generales (géneros y categorías).
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(selectedGenres.length > 0 || selectedCategories.length > 0) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {taxonomyLoading ? (
              <div className="text-xs text-gray-500">Cargando filtros...</div>
            ) : taxonomyError ? (
              <div className="text-xs text-red-400">{taxonomyError}</div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Géneros</div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => {
                      const isActive = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleFilterValue(genre, setSelectedGenres)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                            ${
                              isActive
                                ? 'bg-pink-600 text-white border-pink-500'
                                : 'bg-white/[0.04] text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Categorías
                  </div>
                  <div className="grid gap-3 max-h-[45vh] overflow-y-auto pr-2">
                    {groups.map((group) => (
                      <details key={group.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                        <summary className="cursor-pointer text-sm font-semibold text-white">
                          {group.name}
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.categories.map((category) => {
                            const isActive = selectedCategories.includes(category.name);
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => toggleFilterValue(category.name, setSelectedCategories)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                                  ${
                                    isActive
                                      ? 'bg-violet-600 text-white border-violet-500'
                                      : 'bg-white/[0.04] text-gray-400 border-white/10 hover:border-white/30'
                                  }`}
                              >
                                {category.name}
                              </button>
                            );
                          })}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
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
