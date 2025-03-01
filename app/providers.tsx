'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Always render the SessionProvider, but use suppressHydrationWarning
  // to prevent hydration errors
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </SessionProvider>
  );
} 