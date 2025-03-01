'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { History, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  desktopOpen?: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, desktopOpen = true, toggleSidebar }: SidebarProps) {
  const { data: session, status } = useSession();
  const [paths, setPaths] = useState<any[]>([]);
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

  useEffect(() => {
    // Only fetch paths if the user is authenticated and the sidebar is open
    if (status === 'authenticated' && (isOpen || desktopOpen)) {
      fetchUserPaths();
    }
  }, [status, isOpen, desktopOpen]);

  const fetchUserPaths = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-paths');
      
      if (!response.ok) {
        throw new Error('Failed to fetch learning paths');
      }
      
      const data = await response.json();
      setPaths(data.paths);
    } catch (error) {
      console.error('Error fetching paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 bottom-0 left-0 w-64 bg-[#202323] border-r border-[#303030] z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${desktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'} 
        pt-16 lg:pt-16`}>
        
        {/* Toggle button for mobile */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-10 top-4 bg-[#202323] p-2 rounded-r-md border-r border-t border-b border-[#303030] lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5 text-[#dbdbd9]" /> : <ChevronRight className="h-5 w-5 text-[#dbdbd9]" />}
        </button>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-[#303030]">
            <h2 className="text-lg font-semibold text-[#dbdbd9]">Learning History</h2>
          </div>

          {/* Learning paths list */}
          <div className="flex-grow overflow-y-auto py-2">
            {status === 'authenticated' ? (
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-pulse h-4 w-24 bg-[#303030] rounded"></div>
                  </div>
                ) : paths.length > 0 ? (
                  <div className="space-y-1">
                    {paths.map((path) => (
                      <Link 
                        key={path.id} 
                        href={`/shared/${path.shareId}`}
                        className="block px-4 py-2 hover:bg-[#252828] text-[#dbdbd9] text-sm truncate"
                        onClick={() => {
                          // Close sidebar on mobile when a path is clicked
                          if (window.innerWidth < 1024) {
                            toggleSidebar();
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <History className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{path.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
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

          {/* User profile section */}
          {status === 'authenticated' && session?.user ? (
            <div className="p-4 border-t border-[#303030]">
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
              <button
                onClick={() => signOut()}
                className="mt-4 w-full flex items-center justify-center space-x-2 bg-[#252828] hover:bg-[#303030] text-red-400 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="p-4 border-t border-[#303030]">
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center space-x-2 bg-[#252828] hover:bg-[#303030] text-[#dbdbd9] px-3 py-2 rounded-md text-sm transition-colors"
              >
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 