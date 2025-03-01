'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
  activeUsers?: number;
}

interface LearningPathInputProps {
  onPathGenerated: () => void;
  onShareIdGenerated?: (shareId: string) => void;
}

export function LearningPathInput({ onPathGenerated, onShareIdGenerated }: LearningPathInputProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !mounted) return;
    
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
      
      // Call onPathGenerated to update loading state
      onPathGenerated();
      
      // Automatically save the learning path and redirect
      await saveLearningPath(data.steps);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save learning path');
      }

      const data = await response.json();
      
      // Call onShareIdGenerated to update the shareId state in the parent component
      if (onShareIdGenerated) {
        onShareIdGenerated(data.shareId);
      }
      
      // Redirect to the shared path page
      router.push(`/shared/${data.shareId}`);
    } catch (error) {
      console.error('Error saving learning path:', error);
      // Don't show error to user for automatic saving
    }
  };

  // Show a loading skeleton during SSR and initial client render
  if (!mounted) {
    return (
      <div className="w-full">
        <div className="animate-pulse w-full">
          <div className="h-14 bg-[#202323] rounded-full w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            id="learning-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full px-6 py-4 text-[#dbdbd9] bg-[#202323] border border-[#dbdbd9]/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#dbdbd9]/20 placeholder-[#dbdbd9]/40 font-normal h-[60px] shadow-lg"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {isLoading ? (
              <div className="mr-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#dbdbd9]/70" />
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 text-[#dbdbd9] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-[#2a2e2e] hover:bg-[#3a3e3e] rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/30 rounded-md w-full">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
} 