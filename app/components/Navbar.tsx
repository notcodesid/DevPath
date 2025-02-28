'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  // Always call hooks at the top level
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // For debugging - log session state
  useEffect(() => {
    if (mounted) {
      console.log('Session status:', status);
      console.log('Session data:', session);
    }
  }, [mounted, session, status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show a placeholder during SSR and initial client render
  if (!mounted) {
    return (
      <nav className="bg-[#202323] border-b border-[#dbdbd9]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-[#dbdbd9]">
                DevPath
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/20"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#202323] border-b border-[#dbdbd9]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-[#dbdbd9]">
              DevPath
            </Link>
          </div>
          
          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/20 animate-pulse"></div>
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {session.user.image ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/40 flex items-center justify-center text-[#191a1a] font-medium">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#202323] border border-[#dbdbd9]/20 rounded-md shadow-lg z-10">
                    <div className="p-3 border-b border-[#dbdbd9]/10">
                      <p className="text-sm font-medium text-[#dbdbd9]">{session.user.name}</p>
                      <p className="text-xs text-[#dbdbd9]/60">{session.user.credits} credits</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className=" px-4 py-2 text-sm text-[#dbdbd9] hover:bg-[#dbdbd9]/10 transition-colors flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-[#dbdbd9] hover:bg-[#dbdbd9]/10 transition-colors flex items-center gap-2"
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-[#dbdbd9] hover:text-white px-4 py-2 rounded-md border border-[#dbdbd9]/20 hover:border-[#dbdbd9]/40 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 