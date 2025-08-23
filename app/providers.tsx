'use client';

import { useState, useEffect } from 'react';
import { CivicAuthProvider } from "@civic/auth/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after hydration to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use the mounted state to add a class that can be used for CSS transitions
  // This avoids hydration mismatches while still allowing the UI to be visible during SSR
  return (
    <CivicAuthProvider>
      <div suppressHydrationWarning className={mounted ? 'mounted' : ''}>
        {children}
      </div>
    </CivicAuthProvider>
  );
} 