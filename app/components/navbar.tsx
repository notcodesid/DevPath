"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  LogIn,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useToggleTheme } from "../hooks/useToggleTheme";
import { filterUtilityClasses } from "../utils/filterUtilityClasses";

interface NavbarProps {
  shareId?: string;
  toggleSidebar?: () => void;
  desktopSidebarOpen?: boolean;
}

export default function Navbar({
  shareId,
  toggleSidebar,
  desktopSidebarOpen = true,
}: NavbarProps) {
  const { status } = useSession();
  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    if (shareId) {
      const shareLink = `${window.location.origin}/shared/${shareId}`;
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { theme, toggleTheme } = useToggleTheme();

  console.log(theme);

  return (
    <header
      className={filterUtilityClasses(
        "sticky top-0 z-40 w-full dark:bg-[#151718] bg-white",
        theme
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Mobile sidebar toggle button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-4 p-2 rounded-md text-[#dbdbd9] hover:bg-[#202323] focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop sidebar toggle button */}
            <button
              onClick={toggleSidebar}
              className={filterUtilityClasses(
                "hidden lg:flex mr-4 p-2 rounded-md dark:text-[#dbdbd9] text-gray-600 dark:hover:bg-[#202323] hover:bg-gray-200 focus:outline-none",
                theme
              )}
              aria-label={desktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {desktopSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5 transform transition-transform duration-300" />
              ) : (
                <PanelLeft className="h-5 w-5 transform transition-transform duration-300" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {shareId && (
              <button
                onClick={copyShareLink}
                className="flex items-center space-x-2 bg-[#202323] hover:bg-[#252828] text-[#dbdbd9] px-4 py-2 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>
            )}

            {/* Only show sign in button if not authenticated and no sidebar toggle */}
            {status !== "authenticated" && !toggleSidebar && (
              <button
                onClick={() => signIn("google")}
                className="flex items-center space-x-2 bg-[#202323] hover:bg-[#252828] text-[#dbdbd9] px-4 py-2 rounded-md transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <div
            className={filterUtilityClasses(
              "p-2 rounded-md text-[#dbdbd9] cursor-pointer dark:hover:bg-[#202323] hover:bg-gray-200 focus:outline-none",
              theme
            )}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun
                className={filterUtilityClasses(
                  "w-5 h-5 dark:text-white text-gray-500  transform transition-transform duration-300",
                  theme
                )}
              />
            ) : (
              <Moon
                className={filterUtilityClasses(
                  "w-5 h-5 dark:text-white text-gray-600  transform transition-transform duration-300",
                  theme
                )}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
