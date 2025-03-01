'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, LogIn, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Logo from "@/public/code-merge.png";

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
    <header className="fixed top-0 left-0 right-0 border-b border-[#202323] bg-[#151718] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
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
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </button>
            
            <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
              <Image src={Logo} alt="DevPath" width={25} height={25} />
              <span className="hidden sm:inline">DevPath</span>
            </Link>
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