'use client';

import { useEffect, useState } from 'react';
import { Timeline } from '@/app/components/Timeline';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';

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
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<LearningStep[] | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Safely set the shareId from params
    if (params?.shareId) {
      setCurrentShareId(params.shareId);
    }
  }, [params]);

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

    if (currentShareId) {
      fetchSharedPath();
    }
  }, [currentShareId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !mounted) return;
    
    setIsGenerating(true);
    setError(null);
    setShareId(null);
    
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
      
      // Automatically save the learning path
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save learning path');
      }

      const data = await response.json();
      setShareId(data.shareId);
    } catch (error) {
      console.error('Error saving learning path:', error);
      // Don't show error to user for automatic saving
    }
  };

  const copyShareLink = () => {
    if (!shareId) return;
    
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#dbdbd9]" />
              <p className="text-[#dbdbd9]">Loading shared learning path...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !learningPath) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-6">
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
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9] pb-24">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#dbdbd9]">{learningPath.title}</h1>
            <Link 
              href="/"
              className="px-4 py-2 bg-[#202323] hover:bg-[#2a2e2e] text-[#dbdbd9] rounded-md transition-colors"
            >
              Create Your Own
            </Link>
          </div>
          <p className="text-[#dbdbd9]/70 mt-2">
            {learningPath.description || 'A personalized learning path'}
          </p>
          <p className="text-sm text-[#dbdbd9]/50 mt-1">
            Created on {new Date(learningPath.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <Timeline steps={learningPath.steps} />
        
        {/* Display generated path if available */}
        {generatedPath && (
          <div className="mt-8 border-t border-[#dbdbd9]/10 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#dbdbd9]">Your Generated Path</h2>
              {shareId && (
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-2 px-4 py-2 bg-[#202323] hover:bg-[#2a2e2e] text-[#dbdbd9] rounded-md transition-colors"
                >
                  {copied ? (
                    <span>Copied!</span>
                  ) : (
                    <span>Copy Share Link</span>
                  )}
                </button>
              )}
            </div>
            <Timeline steps={generatedPath} />
          </div>
        )}
      </div>
      
      {/* Fixed input field at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151718] border-t border-[#dbdbd9]/10 p-4 z-10">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to learn (e.g., 'I want to learn Python for data science')"
                className="w-full px-4 py-3 text-[#dbdbd9] bg-[#202323] border border-[#dbdbd9]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dbdbd9]/30 placeholder-[#dbdbd9]/40 font-normal resize-none h-[60px] min-h-[60px]"
                disabled={isGenerating}
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="p-3 h-[60px] w-[60px] flex items-center justify-center text-[#dbdbd9] bg-[#202323] hover:bg-[#2a2e2e] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 