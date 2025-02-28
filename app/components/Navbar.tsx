'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  // Always call hooks at the top level
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
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
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="text-sm text-[#dbdbd9] hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Profile</span>
                  <User className="h-4 w-4" />
                </Link>
                
                <div className="flex items-center space-x-3">
                  {session.user.image ? (
                    <Link href="/profile" className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/40 flex items-center justify-center text-[#191a1a] font-medium">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#dbdbd9]">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-[#dbdbd9]/60">
                      {session.user.credits} credits
                    </span>
                  </div>
                  
                  <button
                    className="ml-2 p-1.5 text-[#dbdbd9] hover:text-white hover:bg-[#dbdbd9]/10 rounded-full transition-colors"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
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