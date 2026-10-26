import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard, MessageCircle, FileText, Shield, Pill, Clock,
  Calendar, Stethoscope, Phone, Settings, Sun, Moon, Monitor,
  Menu, X, Heart, Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ai-assistant', icon: MessageCircle, label: 'AI Assistant' },
  { path: '/reports', icon: FileText, label: 'Report Analyzer' },
  { path: '/vault', icon: Shield, label: 'Medical Vault' },
  { path: '/prescriptions', icon: Pill, label: 'Prescriptions' },
  { path: '/pill-oclock', icon: Clock, label: "Pill O'Clock" },
  { path: '/cycle', icon: Calendar, label: 'My Cycle' },
  { path: '/doctor', icon: Stethoscope, label: 'Talk to Doctor' },
  { path: '/emergency', icon: Phone, label: 'Emergency SOS' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const cycleThemes = () => {
    const order: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % 3]);
    setThemeMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className={`sidebar w-64 h-full flex flex-col p-4 ${sidebarOpen ? 'open' : ''}`}
        style={{ background: 'var(--bg-sidebar)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl gradient-blush flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>SheCare</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your Health Companion 💗</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="relative mt-4">
          <button
            onClick={cycleThemes}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'var(--accent-light)', color: 'var(--text-primary)' }}
          >
            {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-5 h-5 text-lavender-400" />}
            {theme === 'system' && <Monitor className="w-5 h-5 text-blush-500" />}
            <span className="text-sm font-medium capitalize">{theme} Mode</span>
          </button>
        </div>

        {/* User */}
        <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--accent-light)' }}>
          <div className="w-9 h-9 rounded-full gradient-rose flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blush-500" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></div>
              All Systems Active
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
