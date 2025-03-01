'use client';

import { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  shareId?: string;
}

export default function AppLayout({ children, shareId }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
    
    // Check if there's a saved preference for the sidebar state
    const savedState = localStorage.getItem('desktopSidebarOpen');
    if (savedState !== null) {
      setDesktopSidebarOpen(savedState === 'true');
    }
  }, []);

  // Save sidebar state preference when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('desktopSidebarOpen', String(desktopSidebarOpen));
    }
  }, [desktopSidebarOpen, mounted]);

  const toggleSidebar = () => {
    // On mobile, toggle the mobile sidebar
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } 
    // On desktop, toggle the desktop sidebar
    else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  // Show a simple loading state during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
        <div className="h-16 border-b border-[#202323] bg-[#151718]"></div>
        <div className="animate-pulse p-8">
          <div className="h-8 bg-[#202323] rounded-md w-64 mb-6"></div>
          <div className="h-4 bg-[#202323] rounded-md w-full max-w-2xl mb-4"></div>
          <div className="h-4 bg-[#202323] rounded-md w-full max-w-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        desktopOpen={desktopSidebarOpen}
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main content */}
      <div className={`transition-all duration-300 ${desktopSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Navbar */}
        <Navbar 
          shareId={shareId} 
          toggleSidebar={toggleSidebar} 
          desktopSidebarOpen={desktopSidebarOpen}
        />
        
        {/* Page content */}
        <main className="pt-16 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
} 