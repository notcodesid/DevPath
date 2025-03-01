'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
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
        </div>
      </div>
    </nav>
  );
} 