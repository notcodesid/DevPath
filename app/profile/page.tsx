'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { useState, useEffect } from 'react';
import { Timeline } from '../components/Timeline';
import { Loader2 } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: any;
  createdAt: string;
}

export default function ProfilePage() {
  // Always call hooks at the top level
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Only redirect on the client side
      if (typeof window !== 'undefined') {
        redirect('/auth/signin');
      }
    },
  });
  
  const [mounted, setMounted] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's learning paths
  useEffect(() => {
    if (session?.user?.id && mounted) {
      setIsLoading(true);
      fetch(`/api/learning-paths?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setLearningPaths(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching learning paths:', err);
          setIsLoading(false);
        });
    }
  }, [session?.user?.id, mounted]);

  // Don't render anything during SSR to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#191a1a]">
        <Navbar />
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 border-t-2 border-b-2 border-[#dbdbd9]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#191a1a]">
        <Navbar />
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dbdbd9]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-[#202323] rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#dbdbd9] mb-6">Your Profile</h1>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">Name:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.name}</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">Email:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.email}</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">Credits:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.credits}</div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-[#dbdbd9]/10 pt-6">
            <h2 className="text-xl font-semibold text-[#dbdbd9] mb-4">Your Learning Paths</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#dbdbd9]" />
              </div>
            ) : learningPaths.length > 0 ? (
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div 
                    key={path.id} 
                    className="p-4 bg-[#191a1a] rounded-md border border-[#dbdbd9]/10 hover:border-[#dbdbd9]/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-[#dbdbd9]">{path.title}</h3>
                      <span className="text-sm text-[#dbdbd9]/60">
                        {new Date(path.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {selectedPath === path.id && (
                      <div className="mt-4">
                        <Timeline steps={path.steps.steps} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#dbdbd9]/70">You haven't created any learning paths yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 