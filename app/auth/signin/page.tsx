'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleSignIn = async () => {
    if (!mounted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting Google sign-in process...');
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: true
      });
      
      console.log('Sign-in result:', result);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Show a static version during SSR to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191a1a]">
        <div className="max-w-md w-full p-8 bg-[#202323] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-[#dbdbd9] mb-6">Sign in to DevPath</h2>
          <p className="text-[#dbdbd9]/70 text-center mb-8">
            Continue with Google to access personalized learning paths
          </p>
          
          <div className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-md font-medium opacity-70 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#dbdbd9]/50">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191a1a]">
      <div className="max-w-md w-full p-8 bg-[#202323] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#dbdbd9] mb-6">Sign in to DevPath</h2>
        <p className="text-[#dbdbd9]/70 text-center mb-8">
          Continue with Google to access personalized learning paths
        </p>
        
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-[#dbdbd9]/50">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
  
      </div>
    </div>
  );
} 