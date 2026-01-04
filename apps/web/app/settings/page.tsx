'use client';

import {
  Bell,
  Cog,
  Eye,
  Globe,
  Lock,
  Palette,
  Shield,
  Sliders,
  Sparkles,
  User,
  Zap,
  ChevronRight,
  Paintbrush,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Role = 'GUEST' | 'USER' | 'CREATOR' | 'COLLABORATOR' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN' | 'OWNER';

const API_BASE = 'http://localhost:4000';
const THEME_STORAGE_KEY = 'theme-preference';

const ROLE_LABELS: Record<Role, string> = {
  GUEST: 'Invitado',
  USER: 'Usuario',
  CREATOR: 'Creador',
  COLLABORATOR: 'Colaborador',
  MODERATOR: 'Moderador',
  ADMIN: 'Administrador',
  SUPER_ADMIN: 'Admin Senior',
  OWNER: 'Propietario',
};

const ROLE_RANK: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  CREATOR: 2,
  COLLABORATOR: 3,
  MODERATOR: 4,
  ADMIN: 5,
  SUPER_ADMIN: 6,
  OWNER: 7,
};

const roleAtLeast = (role: Role, minimum: Role) => ROLE_RANK[role] >= ROLE_RANK[minimum];

const menuItems = [
  { id: 'general', label: 'General', icon: Cog },
  { id: 'cuenta', label: 'Cuenta', icon: User },
  { id: 'privacidad', label: 'Privacidad', icon: Eye },
  { id: 'seguridad', label: 'Seguridad', icon: Lock },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'personalizacion', label: 'Personalización', icon: Sliders },
  { id: 'branding', label: 'Branding', icon: Paintbrush, minRole: 'OWNER' as Role },
];

export default function SettingsPage() {
  const [activeId, setActiveId] = useState('general');
  const [role, setRole] = useState<Role>('USER');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [theme, setTheme] = useState('dark');

  const applyTheme = (value: string) => {
    const resolved =
      value === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : value;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  };

  useEffect(() => {
    const loadRole = async () => {
      try {
        const response = await fetch(`${API_BASE}/users/me`, { credentials: 'include' });
        if (!response.ok) return;
        const data = (await response.json()) as { role?: Role; theme?: string | null };
        if (data?.role) setRole(data.role);
        if (data?.theme) {
          setTheme(data.theme);
          window.localStorage.setItem(THEME_STORAGE_KEY, data.theme);
          applyTheme(data.theme);
        }
      } catch {
        setRole('USER');
      }
    };
    loadRole();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && stored !== theme) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const handleThemeChange = async (value: string) => {
    setTheme(value);
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
    applyTheme(value);

    try {
      await fetch(`${API_BASE}/users/me/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: value }),
      });
    } catch {
      // Preferencia local ya aplicada; backend se puede reintentar luego.
    }
  };

  const filteredMenu = useMemo(
    () => menuItems.filter((item) => !item.minRole || roleAtLeast(role, item.minRole)),
    [role],
  );

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-600/10 rounded-lg border border-pink-600/20 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-pink-500 tracking-wider uppercase">
              Viernes13
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Configuración</h1>
          <p className="text-sm text-gray-400">Administra tu cuenta y preferencias de la plataforma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 h-fit">
            <div className="flex items-center justify-between px-3 mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Ajustes
              </div>
              <span className="text-[10px] text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <nav className="grid gap-1">
              {filteredMenu.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                    ${
                      item.id === activeId
                        ? 'bg-violet-600 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === activeId && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            {/* General */}
            {activeId === 'general' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Cog className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Configuración general</h2>
                    <p className="text-sm text-gray-400">Preferencias básicas de la plataforma</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Idioma de la interfaz</h3>
                        <p className="text-xs text-gray-400">Elige el idioma de navegación</p>
                      </div>
                      <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none">
                      <option>Español (ES)</option>
                      <option>English (US)</option>
                      <option>Português (BR)</option>
                    </select>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Tema de la aplicación</h3>
                        <p className="text-xs text-gray-400">Personaliza el aspecto visual</p>
                      </div>
                      <Palette className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['dark', 'light', 'auto'].map((t) => (
                        <button
                          key={t}
                          onClick={() => handleThemeChange(t)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all
                            ${theme === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                          {t === 'dark' ? 'Oscuro' : t === 'light' ? 'Claro' : 'Automático'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Zona horaria</h3>
                        <p className="text-xs text-gray-400">Para programar publicaciones y eventos</p>
                      </div>
                      <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none">
                      <option>GMT-5 (Lima, Perú)</option>
                      <option>GMT-3 (Buenos Aires)</option>
                      <option>GMT-6 (Ciudad de México)</option>
                      <option>GMT+1 (Madrid)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Cuenta */}
            {activeId === 'cuenta' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <User className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Información de cuenta</h2>
                    <p className="text-sm text-gray-400">Gestiona tus datos personales</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <label className="block text-sm font-semibold text-white mb-2">Nombre de usuario</label>
                    <input
                      type="text"
                      defaultValue="usuario123"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Tu identificador único en la plataforma</p>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <label className="block text-sm font-semibold text-white mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      defaultValue="usuario@ejemplo.com"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/50"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Verificado</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">Actualizado hace 3 meses</span>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <label className="block text-sm font-semibold text-white mb-2">Biografía</label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos sobre ti..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/50 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
                  </div>

                  <button className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}

            {/* Privacidad */}
            {activeId === 'privacidad' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Eye className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Privacidad y visibilidad</h2>
                    <p className="text-sm text-gray-400">Controla quién puede ver tu contenido</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Perfil público</h3>
                        <p className="text-xs text-gray-400">Permite que otros usuarios vean tu perfil</p>
                      </div>
                      <button
                        onClick={() => setPublicProfile(!publicProfile)}
                        className={`w-11 h-6 rounded-full transition-colors ${publicProfile ? 'bg-violet-600' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${publicProfile ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-white mb-3">Quién puede ver mis historias</h3>
                    <div className="grid gap-2">
                      {['Todos', 'Solo seguidores', 'Solo yo'].map((opt) => (
                        <label key={opt} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                          <input type="radio" name="visibility" className="w-4 h-4 accent-violet-600" />
                          <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-white mb-3">Actividad en línea</h3>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-violet-600" />
                      <span className="text-sm text-gray-300">Mostrar cuando estoy en línea</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeId === 'seguridad' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Lock className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Seguridad de la cuenta</h2>
                    <p className="text-sm text-gray-400">Protege tu acceso y datos</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Cambiar contraseña</h3>
                        <p className="text-xs text-gray-400">Actualizada hace 6 meses</p>
                      </div>
                      <Shield className="w-4 h-4 text-gray-500" />
                    </div>
                    <button className="text-sm text-violet-400 hover:text-violet-300 font-medium">
                      Cambiar contraseña →
                    </button>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Autenticación de dos factores</h3>
                        <p className="text-xs text-gray-400">Agrega una capa extra de seguridad</p>
                      </div>
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                        Recomendado
                      </span>
                    </div>
                    <button className="mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">
                      Activar 2FA →
                    </button>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-white mb-2">Sesiones activas</h3>
                    <p className="text-xs text-gray-400 mb-3">Dispositivos donde has iniciado sesión</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="text-xs text-gray-300">Chrome en Windows • Lima, PE</div>
                        <span className="text-[10px] text-emerald-400">Actual</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeId === 'notificaciones' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Bell className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Notificaciones</h2>
                    <p className="text-sm text-gray-400">Elige cómo quieres recibir actualizaciones</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Notificaciones por email</h3>
                        <p className="text-xs text-gray-400">Recibe resúmenes y alertas importantes</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifs(!emailNotifs)}
                        className={`w-11 h-6 rounded-full transition-colors ${emailNotifs ? 'bg-violet-600' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Notificaciones push</h3>
                        <p className="text-xs text-gray-400">Alertas en tiempo real en tu navegador</p>
                      </div>
                      <button
                        onClick={() => setPushNotifs(!pushNotifs)}
                        className={`w-11 h-6 rounded-full transition-colors ${pushNotifs ? 'bg-violet-600' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-white mb-3">Tipos de notificaciones</h3>
                    <div className="grid gap-2">
                      {[
                        'Nuevos comentarios en mis historias',
                        'Alguien me sigue',
                        'Mis historias destacadas',
                        'Actualizaciones de la plataforma',
                      ].map((opt) => (
                        <label key={opt} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-violet-600" />
                          <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Otros tabs en construcción */}
            {!['general', 'cuenta', 'privacidad', 'seguridad', 'notificaciones'].includes(activeId) && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {menuItems.find((item) => item.id === activeId)?.label}
                    </h2>
                    <p className="text-sm text-gray-400">Esta sección estará disponible próximamente</p>
                  </div>
                </div>
                <div className="border border-white/10 rounded-xl p-8 bg-white/[0.02] text-center">
                  <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Estamos trabajando en esta funcionalidad</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
