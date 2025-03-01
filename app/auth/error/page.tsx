'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Log all error parameters for debugging
    const error = searchParams.get('error');
    console.log('Auth Error:', error);
    console.log('All params:', Object.fromEntries([...searchParams.entries()]));
  }, [searchParams]);
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191a1a]">
        <div className="max-w-md w-full p-8 bg-[#202323] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-[#dbdbd9] mb-6">Authentication Error</h2>
          <div className="animate-pulse h-24 bg-[#191a1a] rounded-md"></div>
        </div>
      </div>
    );
  }
  
  const error = searchParams.get('error');
  const errorDescription = getErrorDescription(error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191a1a]">
      <div className="max-w-md w-full p-8 bg-[#202323] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#dbdbd9] mb-6">Authentication Error</h2>
        
        <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md mb-6">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-[#dbdbd9]/70 mt-2">{errorDescription}</p>
          
          {/* Display all error parameters for debugging */}
          <div className="mt-4 p-3 bg-[#191a1a] rounded-md overflow-auto">
            <pre className="text-xs text-[#dbdbd9]/60">
              {JSON.stringify(Object.fromEntries([...searchParams.entries()]), null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/auth/signin"
            className="px-4 py-2 bg-[#dbdbd9]/10 hover:bg-[#dbdbd9]/20 text-[#dbdbd9] rounded-md transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="px-4 py-2 bg-[#dbdbd9]/10 hover:bg-[#dbdbd9]/20 text-[#dbdbd9] rounded-md transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function getErrorDescription(error: string | null): string {
  switch (error) {
    case 'Configuration':
      return 'There is a problem with the server configuration. Check if your NEXTAUTH_URL and Google OAuth credentials are correctly set.';
    case 'AccessDenied':
      return 'You do not have permission to sign in.';
    case 'Verification':
      return 'The verification link may have been used or has expired.';
    case 'OAuthSignin':
      return 'Error in the OAuth sign-in process. This could be due to a misconfiguration in the Google OAuth settings.';
    case 'OAuthCallback':
      return 'Error in the OAuth callback process. The callback URL might be incorrect or not authorized in your Google OAuth settings.';
    case 'OAuthCreateAccount':
      return 'Could not create a user account with the OAuth provider.';
    case 'EmailCreateAccount':
      return 'Could not create a user account with the email provider.';
    case 'Callback':
      return 'Error in the callback handler.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account.';
    case 'EmailSignin':
      return 'Error sending the email for sign in.';
    case 'CredentialsSignin':
      return 'The sign in attempt failed. Check the details you provided are correct.';
    case 'SessionRequired':
      return 'You must be signed in to access this page.';
    default:
      return 'An unknown error occurred during authentication.';
  }
} 