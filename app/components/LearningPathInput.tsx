'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Timeline } from './Timeline';

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
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<LearningStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
        throw new Error('Failed to generate learning path');
      }

      const data = await response.json();
      
      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error('Invalid response format');
      }
      
      setGeneratedPath(data.steps);
      onPathGenerated(data.steps);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setGeneratedPath([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
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
              disabled={isLoading || !input.trim()}
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