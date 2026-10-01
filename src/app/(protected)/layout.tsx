'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlusCircle, TrendingUp, Settings, Search, Bell, Moon, Sun, ChevronLeft, ChevronRight, Calendar, Leaf, Camera } from 'lucide-react';
import { logout } from './settings/actions';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (pathname === '/onboarding') {
    return <>{children}</>;
  }

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-on-surface)] antialiased min-h-screen transition-colors duration-200">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="fixed top-0 left-0 h-screen w-64 p-4 flex flex-col justify-between z-40 bg-[var(--color-surface-container-lowest)] border-r border-[var(--color-outline-variant)] shadow-sm transition-all duration-300">
        <div>
          {/* Brand & Collapser */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(34,160,107,0.1)] flex items-center justify-center text-[var(--color-primary)]">
                <Leaf size={24} />
              </div>
              <div>
                <span className="font-heading text-lg font-extrabold text-[var(--color-primary)] block leading-tight">NutriLens</span>
                <span className="text-xs text-[var(--color-on-surface-variant)] block">AI Nutrition Lens</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="space-y-1.5">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors duration-150 active:scale-[0.98] ${pathname.startsWith('/dashboard') ? 'bg-[rgba(0,134,86,0.15)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'}`}>
              <LayoutDashboard size={20} />
              <span className="text-sm">Dashboard</span>
            </Link>
            
            <Link href="/diary" className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors duration-150 active:scale-[0.98] ${pathname.startsWith('/diary') ? 'bg-[rgba(0,134,86,0.15)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'}`}>
              <BookOpen size={20} />
              <span className="text-sm">Food Diary</span>
            </Link>
            
            <Link href="/add-meal" className={`flex items-center justify-between px-4 py-3 rounded-full font-semibold transition-colors duration-150 active:scale-[0.98] ${pathname.startsWith('/add-meal') ? 'bg-[rgba(0,134,86,0.15)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'}`}>
              <div className="flex items-center gap-3">
                <PlusCircle size={20} />
                <span className="text-sm">Add Meal</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(34,160,107,0.2)] text-[var(--color-primary)] uppercase tracking-wider">New</span>
            </Link>
            
            <Link href="/progress" className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors duration-150 active:scale-[0.98] ${pathname.startsWith('/progress') ? 'bg-[rgba(0,134,86,0.15)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'}`}>
              <TrendingUp size={20} />
              <span className="text-sm">Progress</span>
            </Link>
            
            <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors duration-150 active:scale-[0.98] ${pathname.startsWith('/settings') ? 'bg-[rgba(0,134,86,0.15)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'}`}>
              <Settings size={20} />
              <span className="text-sm">Settings</span>
            </Link>
          </nav>
          
          {/* Primary CTA Quick trigger */}
          <div className="mt-8 px-2">
            <Link href="/add-meal" className="w-full h-12 bg-[var(--color-primary)] text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
              <Camera size={20} />
              <span>Log Meal</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. TOP APP BAR */}
      <header className="sticky top-0 right-0 z-30 ml-64 w-[calc(100%-16rem)] bg-[var(--color-surface-container-lowest)] backdrop-blur-md border-b border-[var(--color-outline-variant)] shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center w-full px-8 py-3.5">
          {/* Date Switcher Navigator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[var(--color-surface-container-low)] rounded-full p-1 border border-[var(--color-outline-variant)]">
              <button aria-label="Previous day" className="p-1.5 rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-3 py-0.5">
                <Calendar size={18} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-[var(--color-on-surface)]">Today</span>
              </div>
              <button aria-label="Next day" className="p-1.5 rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 text-[var(--color-outline)]" size={20} />
              <input type="text" placeholder="Search foods, meals, or nutrients..." className="w-full h-11 pl-11 pr-14 rounded-2xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(34,160,107,0.2)] text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] transition-all outline-none" />
              <kbd className="absolute right-3 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] rounded border border-[var(--color-outline-variant)]">⌘K</kbd>
            </div>
          </div>
          
          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button aria-label="Toggle dark mode" className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-colors">
              <Sun size={20} />
            </button>
            <button aria-label="Notifications" className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-secondary-container)] ring-2 ring-[var(--color-surface-container-lowest)]"></span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT CANVAS */}
      <main className="ml-64 w-[calc(100%-16rem)] p-8 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
