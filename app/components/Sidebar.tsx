'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import Image from 'next/image';
import Logo from "@/public/code-merge.png";

interface LearningPath {
  id: string;
  title: string;
  shareId: string;
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  desktopOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, desktopOpen, toggleSidebar }: SidebarProps) {
  const { data: session, status } = useSession();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's initials for avatar fallback
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Fetch user's learning paths
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserPaths();
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const fetchUserPaths = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-paths');
      if (response.ok) {
        const data = await response.json();
        setPaths(data.paths || []);
      }
    } catch (error) {
      console.error('Error fetching user paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#303030] flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <Image src={Logo} alt="DevPath" width={25} height={25} />
          <span className={`${isOpen ? 'inline' : 'hidden'} sm:inline`}>DevPath</span>
        </Link>
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[#303030] transition-colors"
          aria-label={desktopOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${!desktopOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Learning paths list - flex-grow to push profile to bottom */}
      <div className="flex-grow overflow-y-auto py-2">
        <div className="space-y-1">
          {status === 'authenticated' ? (
            <>
              {isLoading ? (
                <div className="px-4 py-2">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-[#252828] rounded w-3/4"></div>
                    <div className="h-4 bg-[#252828] rounded w-1/2"></div>
                    <div className="h-4 bg-[#252828] rounded w-5/6"></div>
                  </div>
                </div>
              ) : paths.length > 0 ? (
                paths.map(path => (
                  <Link 
                    key={path.id} 
                    href={`/shared/${path.shareId}`}
                    className="block px-4 py-2 text-[#dbdbd9] hover:bg-[#252828] transition-colors"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <div className="font-medium">{path.title}</div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-[#dbdbd9]/70 text-sm">
                  No learning paths yet
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-2 text-[#dbdbd9]/70 text-sm">
              Sign in to see your learning history
            </div>
          )}
        </div>
      </div>

      {/* User profile section - at the bottom */}
      <div className="mt-auto border-t border-[#303030]">
        {status === 'authenticated' && session?.user ? (
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-[#dbdbd9]/20">
                <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                <AvatarFallback className="bg-[#2563eb]">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#dbdbd9] truncate">{session.user.name}</p>
                <p className="text-xs text-[#dbdbd9]/70 truncate">{session.user.email}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => signOut()}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#252828] hover:bg-[#303030] text-red-400 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <button
              onClick={() => window.location.href = '/api/auth/signin'}
              className="w-full flex items-center justify-center space-x-2 bg-[#252828] hover:bg-[#303030] text-[#dbdbd9] px-4 py-2 rounded-md text-sm transition-colors"
            >
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 