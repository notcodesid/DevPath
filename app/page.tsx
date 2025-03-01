'use client';

import { useState } from 'react';
import { LearningPathInput } from './components/LearningPathInput';
import Navbar from './components/navbar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [shareId, setShareId] = useState<string | undefined>(undefined);

  const handlePathGenerated = () => {
    setIsLoading(false);
  };

  const handleShareIdGenerated = (id: string) => {
    setShareId(id);
  };

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9]">
      <Navbar shareId={shareId} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">What do you want to learn?</h1>
          <p className="text-[#dbdbd9]/70 text-lg">
            We&apos;ll create a personalized learning path for you
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <LearningPathInput 
            onPathGenerated={() => {
              setIsLoading(true);
              handlePathGenerated();
            }}
            onShareIdGenerated={handleShareIdGenerated}
          />
        </div>

        {isLoading && (
          <div className="mt-12 w-full max-w-2xl">
            <div className="h-8 w-64 bg-[#202323] rounded-md animate-pulse mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#202323] animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#202323] rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-[#202323] rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
