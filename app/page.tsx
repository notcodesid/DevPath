'use client';

import { useState, useEffect } from 'react';
import { LearningPathInput } from "./components/LearningPathInput";
import { Navbar } from "./components/Navbar";

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
  activeUsers?: number;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePathGenerated = (steps: LearningStep[]) => {
    // We can use this callback for analytics or other purposes in the future
    console.log('Learning path generated with', steps.length, 'steps');
  };

  // Show a static version during SSR to prevent hydration errors
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#191a1a]">
        <div className="h-16 bg-[#202323] border-b border-[#dbdbd9]/10"></div>
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
          <div className="mb-16">
            <div className="h-12 w-3/4 bg-[#202323] rounded"></div>
            <div className="mt-4 h-6 w-1/2 bg-[#202323] rounded"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-[#202323] rounded"></div>
            <div className="h-32 bg-[#202323] rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#191a1a]">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-[#dbdbd9] sm:text-5xl">
            Project-based learning
          </h1>
          <p className="mt-4 text-xl font-normal text-[#dbdbd9]/70">
            Tell us what you want to learn, and we&apos;ll create a personalized learning path
          </p>
        </div>

        <LearningPathInput onPathGenerated={handlePathGenerated} />
      </div>
    </main>
  );
}
