'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  shareId: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/');
    }

    // Fetch user's learning paths
    if (status === 'authenticated') {
      fetchUserPaths();
    }
  }, [status, router]);

  const fetchUserPaths = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-paths');
      
      if (!response.ok) {
        throw new Error('Failed to fetch learning paths');
      }
      
      const data = await response.json();
      setPaths(data.paths);
    } catch (error) {
      console.error('Error fetching paths:', error);
      setError('Failed to load your learning paths. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#dbdbd9]" />
          <p className="mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Learning Paths</h1>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-100 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {paths.length === 0 && !error ? (
          <div className="bg-[#202323] p-6 rounded-lg text-center">
            <p className="mb-4">You haven't created any learning paths yet.</p>
            <Link 
              href="/" 
              className="inline-block bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md transition-colors"
            >
              Create Your First Path
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path) => (
              <div key={path.id} className="bg-[#202323] p-6 rounded-lg hover:bg-[#252828] transition-colors">
                <h2 className="text-xl font-semibold mb-2 text-white">{path.title}</h2>
                <p className="text-sm text-[#dbdbd9]/70 mb-4">
                  Created on {new Date(path.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/shared/${path.shareId}`}
                  className="text-[#2563eb] hover:text-[#3b82f6] font-medium"
                >
                  View Path →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 