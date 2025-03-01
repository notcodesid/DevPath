'use client';

import { useEffect, useState } from 'react';
import { Timeline } from '@/app/components/Timeline';
import { Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const fetchSharedPath = async () => {
      try {
        const response = await fetch(`/api/shared-path/${params.shareId}`);
        
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

    if (params.shareId) {
      fetchSharedPath();
    }
  }, [params.shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-6">
        <div className="max-w-5xl mx-auto">
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

  if (error) {
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
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-6">
      <div className="max-w-5xl mx-auto">
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
      </div>
    </div>
  );
} 