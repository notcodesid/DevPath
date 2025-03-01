'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, LogIn, LogOut, User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Logo from "@/public/code-merge.png"

interface NavbarProps {
  shareId?: string;
}

export default function Navbar({ shareId }: NavbarProps) {
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
    <header className="border-b border-[#202323] bg-[#151718]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              <Image   src={Logo} alt="DevPath" width={25} height={25} />
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
            
            {status === 'authenticated' && (
              <Link
                href="/profile"
                className="flex items-center space-x-2 bg-[#202323] hover:bg-[#252828] text-[#dbdbd9] px-4 py-2 rounded-md transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            )}
            
            {status === 'authenticated' ? (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 bg-[#202323] hover:bg-[#252828] text-[#dbdbd9] px-4 py-2 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
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