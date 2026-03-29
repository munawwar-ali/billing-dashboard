import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, clearAuth } from '../utils/auth';
import { 
  Building2, LayoutDashboard, Receipt, Activity, 
  Search, Bell, Moon, Sun, ChevronUp, LogOut,
  User, Command, Menu, X
} from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    setUser(auth?.user);
    setTenant(auth?.tenant);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // If not authenticated, render minimalistic public top nav
  if (!user) {
    return (
      <nav className="h-16 border-b border-border-subtle flex items-center px-6 justify-between bg-navy-900/80 backdrop-blur top-0 fixed w-full z-50">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          NexaBill
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-all shadow-lg shadow-indigo-500/20">Get Started</Link>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { name: 'Tenants', icon: Building2, path: '/tenants' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Usage', icon: Activity, path: '/usage' },
    { name: 'Billing', icon: Receipt, path: '/billing' },
  ];

  return (
    <>
      {/* SIDEBAR (Desktop) */}
      <aside className="fixed hidden md:flex flex-col top-0 left-0 w-[240px] h-screen bg-[#0A0F1E] border-r border-border-subtle z-50">
        
        {/* Tenant Switcher */}
        <div className="h-16 flex items-center px-4 border-b border-border-subtle shrink-0">
          <HeadlessMenu as="div" className="relative w-full text-left">
            <HeadlessMenu.Button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 shrink-0 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                  {tenant?.name?.charAt(0) || 'O'}
                </div>
                <span className="truncate max-w-[120px]">{tenant?.name || 'Organization'}</span>
              </div>
              <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
            </HeadlessMenu.Button>
            
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 top-full mt-2 w-full origin-top-right rounded-md bg-slate-850 border border-border-subtle shadow-xl focus:outline-none z-50 flex flex-col p-1">
                <div className="py-1 px-3 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch workspace</div>
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors", active ? "bg-slate-800 text-white" : "text-slate-300")}>
                      <div className="w-5 h-5 shrink-0 rounded bg-slate-700 flex items-center justify-center text-xs">C</div>
                      <span className="truncate">Current Org</span>
                    </button>
                  )}
                </HeadlessMenu.Item>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu</div>
          {navLinks.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group overflow-hidden",
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-indigo-500/10 rounded-md border border-indigo-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 rounded-r-md bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  </motion.div>
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-border-subtle shrink-0">
          <HeadlessMenu as="div" className="relative w-full text-left">
            <HeadlessMenu.Button className="w-full flex flex-col px-3 py-2 text-sm text-left rounded-md hover:bg-slate-800/50 transition-colors">
              <span className="font-semibold text-slate-200 truncate">{user?.name || 'Admin User'}</span>
              <span className="text-xs text-slate-500 truncate">{user?.email || 'admin@nexa.com'}</span>
            </HeadlessMenu.Button>
            
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute left-0 bottom-full mb-2 w-full origin-bottom-left rounded-md bg-slate-850 border border-border-subtle shadow-xl focus:outline-none overflow-hidden flex flex-col p-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors", active ? "bg-slate-800 text-white" : "text-slate-300")}>
                      <User className="w-4 h-4" /> Profile
                    </button>
                  )}
                </HeadlessMenu.Item>
                <div className="h-px bg-border-subtle my-1" />
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button 
                      onClick={handleLogout}
                      className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors", active ? "bg-slate-800 text-rose-400" : "text-rose-500/80")}
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  )}
                </HeadlessMenu.Item>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>
      </aside>

      {/* TOPBAR (Desktop) */}
      <header className="hidden md:flex ml-[240px] h-16 border-b border-border-subtle bg-navy-900/80 backdrop-blur top-0 sticky z-40 px-8 items-center justify-between">
        <div className="flex items-center text-sm font-medium text-slate-400">
          <span className="capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
        </div>
        
        <div className="flex items-center gap-5">
          {/* Dummy Global Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-14 py-1.5 bg-slate-850 border border-border-subtle rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
              <kbd className="bg-slate-800 border border-border-subtle rounded px-1.5 text-[10px] text-slate-400 font-mono shadow-sm"><Command className="w-3 h-3 inline pb-0.5" />K</kbd>
            </div>
          </div>
          
          {/* Notifications */}
          <button className="relative text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-navy-900 filter drop-shadow"></span>
          </button>
          
          <div className="w-px h-6 bg-border-subtle mx-1" />
          
          <button className="text-slate-400 hover:text-amber-400 transition-colors">
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex h-16 border-b border-border-subtle bg-navy-900/80 backdrop-blur sticky top-0 z-50 px-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-lg">
          <div className="w-7 h-7 rounded-md bg-indigo-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          NexaBill
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-slate-400">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-navy-900"></span>
          </button>
          
          <button 
            className="text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* MOBILE MENU (Slide down) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            className="md:hidden fixed top-16 left-0 w-full bg-slate-900 border-b border-border-subtle z-40 overflow-hidden shadow-2xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="px-4 py-6 space-y-1">
              <div className="mb-4 pb-4 border-b border-border-subtle">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workspace</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {tenant?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <div className="text-slate-200 font-semibold">{tenant?.name || 'Organization'}</div>
                    <div className="text-slate-500 text-xs">{tenant?.plan || 'Free'} Plan</div>
                  </div>
                </div>
              </div>
            
              {navLinks.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-indigo-500/10 text-white border border-indigo-500/20" : "text-slate-400"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-500")} />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t border-border-subtle">
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg text-rose-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Sign out
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}