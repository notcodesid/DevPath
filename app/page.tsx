'use client';

import { useState } from 'react';
import { LearningPathInput } from './components/LearningPathInput';
import { Timeline } from './components/Timeline';
import AppLayout from './components/AppLayout';

export default function Home() {
  const [generatedPath, setGeneratedPath] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const handlePathGenerated = () => {
    setGeneratedPath(true);
  };

  const handleShareIdGenerated = (id: string) => {
    setShareId(id);
  };

  return (
    <AppLayout shareId={shareId || undefined}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {!generatedPath ? (
          <>
            <div className="w-full max-w-2xl mx-auto text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">What do you want to learn?</h1>
              <p className="text-[#dbdbd9]/70 text-lg mb-2">
                We&apos;ll create a personalized learning path for you
              </p>
              <p className="text-[#dbdbd9]/50 text-sm">
                No sign-up required - just ask and get your roadmap instantly
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <LearningPathInput 
                onPathGenerated={handlePathGenerated} 
                onShareIdGenerated={handleShareIdGenerated}
              />
            </div>
          </>
        ) : (
          <div className="w-full max-w-4xl">
            <Timeline steps={[]} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
