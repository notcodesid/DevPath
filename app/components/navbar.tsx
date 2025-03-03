'use client';

import { useState } from 'react';
import { Copy, Check, LogIn, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

interface NavbarProps {
  shareId?: string;
  toggleSidebar?: () => void;
  desktopSidebarOpen?: boolean;
}

export default function Navbar({ shareId, toggleSidebar, desktopSidebarOpen = true }: NavbarProps) {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202323] bg-[#151718]">
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
              className="hidden lg:flex mr-4 p-2 rounded-md text-[#dbdbd9] hover:bg-[#202323] focus:outline-none"
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
            {status !== 'authenticated' && !toggleSidebar && (
              <button
                onClick={() => signIn('google')}
                className="flex items-center space-x-2 bg-[#202323] hover:bg-[#252828] text-[#dbdbd9] px-4 py-2 rounded-md transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}   