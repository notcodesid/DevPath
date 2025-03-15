'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  onShareIdGenerated?: (shareId: string) => void;
}

export function LearningPathInput({ onPathGenerated, onShareIdGenerated }: LearningPathInputProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePath = async (): Promise<{ steps: LearningStep[] }> => {
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

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !mounted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      let currentRetry = 0;

      while (currentRetry <= retryCount) {
        try {
          data = await generatePath();
          break;
        } catch (error) {
          if (currentRetry === retryCount) {
            throw error;
          }
          currentRetry++;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentRetry) * 1000));
        }
      }

      if (!data) {
        throw new Error('Failed to generate learning path after retries');
      }
      
      // Call onPathGenerated with the generated steps
      onPathGenerated(data.steps);
      
      // Only save path if user is authenticated
      if (session?.user) {
        await saveLearningPath(data.steps);
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (errorMessage.includes('timeout') || errorMessage.includes('abort')) {
        setError('The request took too long. Please try again with a more specific query.');
      } else {
        setError(errorMessage);
      }

      // Increment retry count if we haven't reached max retries
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
      }
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
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save learning path');
      }

      const data = await response.json();
      
      if (onShareIdGenerated) {
        onShareIdGenerated(data.shareId);
      }
      
      router.push(`/shared/${data.shareId}`);
    } catch (error) {
      console.error('Error saving learning path:', error);
      setError('Failed to save the learning path. Please try again.');
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
          {retryCount > 0 && retryCount < MAX_RETRIES && (
            <p className="text-red-400 mt-2">
              Retrying... Attempt {retryCount + 1} of {MAX_RETRIES + 1}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 