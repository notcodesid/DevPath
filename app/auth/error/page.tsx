'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AppLayout from '@/app/components/AppLayout';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full p-6 bg-[#202323] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-[#dbdbd9] mb-4">
          {error || 'An error occurred during authentication. Please try again.'}
        </p>
        <Link
          href="/"
          className="block w-full text-center bg-[#2563eb] text-white py-2 px-4 rounded hover:bg-[#1d4ed8] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#dbdbd9]"></div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </AppLayout>
  );
} 