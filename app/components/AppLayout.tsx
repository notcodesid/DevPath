"use client";

import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import { useToggleTheme } from "../hooks/useToggleTheme";
import { filterUtilityClasses } from "../utils/filterUtilityClasses";

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
    const savedState = localStorage.getItem("desktopSidebarOpen");
    if (savedState !== null) {
      setDesktopSidebarOpen(savedState === "true");
    }
  }, []);

  // Save sidebar state preference when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("desktopSidebarOpen", String(desktopSidebarOpen));
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

  const { theme } = useToggleTheme();

  console.log(
    filterUtilityClasses(
      "relative min-h-screen dark:bg-[#151718] bg-white text-[#dbdbd9]",
      theme
    )
  );

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
    <div
      className={filterUtilityClasses(
        "relative min-h-screen dark:bg-[#151718] bg-white text-[#dbdbd9]",
        theme
      )}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 
          w-64  border-r 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopSidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"}
          ${filterUtilityClasses(
            "dark:bg-[#202323] bg-[#F9F9F9] dark:border-[#303030] border-gray-200",
            theme
          )}
        `}
      >
        <Sidebar
          isOpen={sidebarOpen}
          desktopOpen={desktopSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main content area */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${desktopSidebarOpen ? "lg:pl-64" : "lg:pl-0"}
        `}
      >
        {/* Navbar */}
        <Navbar
          shareId={shareId}
          toggleSidebar={toggleSidebar}
          desktopSidebarOpen={desktopSidebarOpen}
        />

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
