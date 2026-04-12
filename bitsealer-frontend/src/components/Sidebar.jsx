import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';

const items = [
  { label: 'Inicio', href: '/dashboard', emoji: '🏠' },
  { label: 'Sellar Archivo', href: '/upload', emoji: '🧾' },
  { label: 'Historial', href: '/history', emoji: '📜' },
  { label: 'Ajustes', href: '/settings', emoji: '⚙️' },
];

export default function Sidebar() {
  return (
    <aside
      className="
        hidden md:flex md:flex-col
        w-64 min-h-screen
        bg-white dark:bg-neutral-900
        border-r border-gray-200 dark:border-neutral-800
        sticky top-0
      "
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <BrandLogo className="text-2xl" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((it) => (
          <NavLink
            key={it.href}
            to={it.href}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3',
                'px-3 py-2 rounded-lg',
                'text-sm font-medium',
                'transition-all duration-150',
                isActive
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
              ].join(' ')
            }
          >
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-200 dark:border-neutral-800 text-xs text-gray-500 dark:text-neutral-400">
        © {new Date().getFullYear()} BitSealer
      </div>
    </aside>
  );
}