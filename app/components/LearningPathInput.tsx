'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Timeline } from './Timeline';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
  activeUsers?: number;
}

interface LearningPathInputProps {
  onPathGenerated: (steps: LearningStep[]) => void;
}

export function LearningPathInput({ onPathGenerated }: LearningPathInputProps) {
  // Always call hooks at the top level
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<LearningStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update credits remaining when session is available
  useEffect(() => {
    if (session?.user?.credits !== undefined) {
      setCreditsRemaining(session.user.credits);
    }
  }, [session?.user?.credits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !mounted) return;
    
    // Check if user is authenticated
    if (!session) {
      setError('Please sign in to generate a learning path');
      return;
    }

    setIsLoading(true);
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
      
      setGeneratedPath(data.steps);
      onPathGenerated(data.steps);
      
      // Update credits remaining
      if (data.creditsRemaining !== undefined) {
        setCreditsRemaining(data.creditsRemaining);
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setGeneratedPath([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show a loading skeleton during SSR and initial client render
  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-[#202323] rounded"></div>
          <div className="h-32 bg-[#202323] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Credits display */}
      {session && (
        <div className="mb-4 flex justify-end">
          <div className="text-sm font-medium text-[#dbdbd9]">
            Credits remaining: <span className="font-bold">{creditsRemaining !== null ? creditsRemaining : session.user.credits}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="learning-input" className="text-lg font-medium text-[#dbdbd9]">
            What would you like to learn?
          </label>
          <p className="text-sm font-normal text-[#dbdbd9]/70 leading-relaxed">
            Describe your learning goals and experience level, and we&apos;ll create a personalized learning path for you.
          </p>
          <div className="relative">
            <textarea
              id="learning-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I want to learn React from scratch and build modern web applications..."
              className="w-full h-32 px-4 py-2 text-[#dbdbd9] bg-[#202323] border border-[#dbdbd9]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dbdbd9]/30 placeholder-[#dbdbd9]/40 font-normal"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !session || (creditsRemaining !== null && creditsRemaining <= 0)}
              className="absolute bottom-3 right-3 p-2 text-[#dbdbd9] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </form>
      
      {!session && status !== 'loading' && (
        <div className="mt-4 p-4 bg-[#202323] border border-[#dbdbd9]/20 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-[#dbdbd9]" />
            <p className="text-[#dbdbd9]">
              Please <Link href="/auth/signin" className="text-[#dbdbd9] underline hover:text-white">sign in</Link> to generate a learning path.
            </p>
          </div>
        </div>
      )}
      
      {session && creditsRemaining === 0 && (
        <div className="mt-4 p-4 bg-amber-900/20 border border-amber-900/30 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <p className="text-amber-400">
              You have no credits remaining. Please upgrade your account to generate more learning paths.
            </p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#dbdbd9]" />
            <p className="text-[#dbdbd9]">Generating your personalized learning path...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/30 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {generatedPath.length > 0 && (
        <div className="mt-8">
          <Timeline steps={generatedPath} />
        </div>
      )}
    </div>
  );
} 