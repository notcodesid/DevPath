'use client';

import { LearningPathInput } from "./components/LearningPathInput";

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
  activeUsers?: number;
}

export default function Home() {
  const handlePathGenerated = (steps: LearningStep[]) => {
    // We can use this callback for analytics or other purposes in the future
    console.log('Learning path generated with', steps.length, 'steps');
  };

  return (
    <main className="min-h-screen bg-[#191a1a]">
      <div className=" max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className=" mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-[#dbdbd9] sm:text-5xl">
            DevPath, Project-based learning
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
