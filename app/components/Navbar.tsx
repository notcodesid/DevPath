'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            {!isMounted ? (
              <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/20"></div>
            ) : isLoading ? (
              <div className="h-8 w-8 rounded-full bg-[#dbdbd9]/20 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="text-sm text-[#dbdbd9] hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <div className="text-sm text-[#dbdbd9]">
                  {session.user.name}
                </div>
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 text-[#dbdbd9] hover:text-white"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    {session.user.image && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm">Sign out</span>
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