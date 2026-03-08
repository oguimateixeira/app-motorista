import { useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { HomePage } from './pages/HomePage';
import { VehiclePage } from './pages/VehiclePage';
import { RideInputPage } from './pages/RideInputPage';
import { WorthItPage } from './pages/WorthItPage';
import { DailyGoalPage } from './pages/DailyGoalPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { to: '/', label: 'Início', icon: '🏠' },
    { to: '/worth-it', label: 'Vale a pena?', icon: '✓' },
    { to: '/ride', label: 'Corrida', icon: '➕' },
    { to: '/goal', label: 'Meta', icon: '🎯' },
    { to: '/history', label: 'Histórico', icon: '📋' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Driver Profit
          </h1>
          <div className="flex items-center gap-2">
            <NavLink
              to="/vehicle"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Veículo"
            >
              🚗
            </NavLink>
            <NavLink
              to="/settings"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Configurações"
            >
              ⚙️
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 pb-24">
        {children}
      </main>

      {!isHome && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 safe-area-pb">
          <div className="flex justify-around py-2">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg min-w-[56px] text-sm ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30'
                      : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

function ThemeSync() {
  const theme = useAppStore((s) => s.settings.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      const q = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () => root.classList.toggle('dark', q.matches);
      apply();
      q.addEventListener('change', apply);
      return () => q.removeEventListener('change', apply);
    }
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicle" element={<VehiclePage />} />
          <Route path="/ride" element={<RideInputPage />} />
          <Route path="/worth-it" element={<WorthItPage />} />
          <Route path="/goal" element={<DailyGoalPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </>
  );
}
