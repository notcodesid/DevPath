'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Always render the children with suppressHydrationWarning
  // to prevent hydration errors
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
} 