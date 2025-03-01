'use client';

import { useEffect, useState } from 'react';
import { Timeline } from '@/app/components/Timeline';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/navbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: LearningStep[];
  createdAt: string;
  shareId: string;
}

export default function SharedPathPage({ params }: { params: { shareId: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const shareId = params.shareId;
  
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Safely set the shareId from params
    if (shareId) {
      setCurrentShareId(shareId);
    }
  }, [shareId]);

  useEffect(() => {
    const fetchSharedPath = async () => {
      if (!currentShareId) return;
      
      try {
        const response = await fetch(`/api/shared-path/${currentShareId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Learning path not found');
          }
          throw new Error('Failed to load learning path');
        }
        
        const data = await response.json();
        setLearningPath(data);
      } catch (error) {
        console.error('Error fetching shared path:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentShareId && mounted) {
      fetchSharedPath();
    }
  }, [currentShareId, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate learning path');
      }

      const data = await response.json();
      
      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error('Invalid response format');
      }
      
      // Automatically save the learning path and redirect to new page
      await saveLearningPath(data.steps);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLearningPath = async (steps: LearningStep[]) => {
    try {
      const response = await fetch('/api/save-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input,
          steps: steps,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save learning path');
      }

      const data = await response.json();
      // Redirect to the new shared path page
      router.push(`/shared/${data.shareId}`);
    } catch (error) {
      console.error('Error saving learning path:', error);
      // Don't show error to user for automatic saving
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
        <Navbar />
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#dbdbd9]" />
                <p className="text-[#dbdbd9]">Loading shared learning path...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !learningPath) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
        <Navbar />
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md max-w-md w-full">
                <p className="text-red-400 text-center">{error}</p>
              </div>
              <Link 
                href="/"
                className="px-4 py-2 bg-[#202323] hover:bg-[#2a2e2e] text-[#dbdbd9] rounded-md transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
        <Navbar />
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-900/30 rounded-md max-w-md w-full">
                <p className="text-yellow-400 text-center">Learning path not found</p>
              </div>
              <Link 
                href="/"
                className="px-4 py-2 bg-[#202323] hover:bg-[#2a2e2e] text-[#dbdbd9] rounded-md transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
      <Navbar shareId={shareId} />
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{learningPath.title}</h1>
          </div>
          <p className="text-[#dbdbd9]/70 mt-2">
            {learningPath.description || 'A personalized learning path'}
          </p>
          <p className="text-sm text-[#dbdbd9]/50 mt-1">
            Created on {new Date(learningPath.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Timeline steps={learningPath.steps} />
        </div>
      </div>
      
      {/* Fixed input field at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151718] border-t border-[#dbdbd9]/10 p-4 z-10">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="w-full px-6 py-4 text-[#dbdbd9] bg-[#202323] border border-[#dbdbd9]/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#dbdbd9]/20 placeholder-[#dbdbd9]/40 font-normal h-[60px] shadow-lg"
                disabled={isGenerating}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isGenerating ? (
                  <div className="mr-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#dbdbd9]/70" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isGenerating || !input.trim()}
                    className="p-2 text-[#dbdbd9] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-[#2a2e2e] hover:bg-[#3a3e3e] rounded-full h-10 w-10 flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 