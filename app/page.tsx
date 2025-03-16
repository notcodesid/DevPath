"use client";

import { useState } from "react";
import { LearningPathInput } from "./components/LearningPathInput";
import { Timeline } from "./components/Timeline";
import AppLayout from "./components/AppLayout";
import { useToggleTheme } from "./hooks/useToggleTheme";
import { filterUtilityClasses } from "./utils/filterUtilityClasses";

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
}

export default function Home() {
  const [generatedPath, setGeneratedPath] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [steps, setSteps] = useState<LearningStep[]>([]);

  const handlePathGenerated = (generatedSteps: LearningStep[]) => {
    setGeneratedPath(true);
    setSteps(generatedSteps);
  };

  const handleShareIdGenerated = (id: string) => {
    setShareId(id);
  };

  const { theme } = useToggleTheme();

  return (
    <AppLayout shareId={shareId || undefined}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {!generatedPath ? (
          <>
            <div className="w-full max-w-2xl mx-auto text-center mb-8">
              <h1
                className={`${filterUtilityClasses(
                  "dark:text-white text-black font-bold mb-4",
                  theme
                )} text-4xl`}
              >
                What do you want to learn?
              </h1>

              <p
                className={`${filterUtilityClasses(
                  "text-gray-500 dark:text-[#dbdbd9]/70 mb-2",
                  theme
                )} text-lg`}
              >
                We&apos;ll create a personalized learning path for you
              </p>
              <p
                className={`${filterUtilityClasses(
                  "dark:text-[#dbdbd9]/50 text-gray-500 ",
                  theme
                )} text-sm`}
              >
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
            <Timeline steps={steps} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
