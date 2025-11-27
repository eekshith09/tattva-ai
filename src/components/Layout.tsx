import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Youtube, 
  ScanText, 
  Image as ImageIcon, 
  History, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Coins,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { pathname } = useLocation();
  const { logout } = useApp();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/text-summary', icon: FileText, label: 'Text Summarizer' },
    { to: '/youtube-summary', icon: Youtube, label: 'YouTube AI' },
    { to: '/ocr', icon: ScanText, label: 'OCR Scanner' },
    { to: '/image-notes', icon: ImageIcon, label: 'Image to Notes' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/rewards', icon: Award, label: 'Rewards' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const activeClass = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium";
  const inactiveClass = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              TattvaAI
            </span>
            <button className="ml-auto lg:hidden" onClick={onClose}>
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm ${pathname === link.to ? activeClass : inactiveClass}`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
                {pathname === link.to && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            ))}
          </nav>

          {/* Footer User/Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user, theme, toggleTheme } = useApp();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4 lg:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
          Welcome back, {user?.name.split(' ')[0]}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Coins Badge */}
        <div className="hidden sm:flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm font-medium">
          <Coins className="w-4 h-4 mr-1.5" />
          {user?.coins} Coins
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-200 overflow-hidden">
          <img src={user?.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useApp();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`
          fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transform transition-all animate-float
          flex items-center gap-3 z-50
          ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}
        `}>
          {toast.type === 'success' ? <Award className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};