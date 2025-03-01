'use client';

import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import Logo from "@/public/code-merge.png"
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  shareId?: string;
}

export default function Navbar({ shareId }: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyShareLink = () => {
    if (!shareId || !mounted) return;
    
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <header className="border-b border-[#dbdbd9]/5" p-2>
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
            <Link href="/"> 
          <span className="text-lg font-semibold text-white">
            <Image src={Logo} alt="DevPath" width={25} height={25} />
          </span>
        </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {shareId && (
            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#202323] hover:bg-[#2a2e2e] text-[#dbdbd9] rounded-full transition-colors text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}   