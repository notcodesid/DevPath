'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Code } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';

interface TimelineStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
  activeUsers?: number; // Keeping for backward compatibility but not using
}

interface TimelineProps {
  steps: TimelineStep[];
}

// Function to detect and convert markdown-style links to HTML
const formatSubStep = (subStep: string) => {
  // Check if the substep contains a markdown link
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const hasLink = linkRegex.test(subStep);
  
  if (hasLink) {
    // Replace markdown links with HTML links
    return subStep.replace(linkRegex, (match, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#dbdbd9] underline hover:text-white inline-flex items-center gap-1">${text}<span class="inline-block w-3 h-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span></a>`;
    });
  }
  
  return subStep;
};

// Function to extract the maximum hour value from a duration string
const getMaxHours = (duration: string): number => {
  // Try to extract numbers from the duration string
  const hourMatches = duration.match(/(\d+)[-\s]*(\d+)?\s*hours?/i);
  const dayMatches = duration.match(/(\d+)[-\s]*(\d+)?\s*days?/i);
  const weekMatches = duration.match(/(\d+)[-\s]*(\d+)?\s*weeks?/i);
  
  if (hourMatches) {
    // Return the maximum hour value
    return hourMatches[2] ? parseInt(hourMatches[2]) : parseInt(hourMatches[1]);
  } else if (dayMatches) {
    // Convert days to hours (assuming 4 hours per day)
    const maxDays = dayMatches[2] ? parseInt(dayMatches[2]) : parseInt(dayMatches[1]);
    return maxDays * 4;
  } else if (weekMatches) {
    // Convert weeks to hours (assuming 4 hours per day, 5 days per week)
    const maxWeeks = weekMatches[2] ? parseInt(weekMatches[2]) : parseInt(weekMatches[1]);
    return maxWeeks * 4 * 5;
  }
  
  // Default fallback
  return 0;
};

// Function to normalize durations to ensure they're always increasing
const normalizeDurations = (steps: TimelineStep[]): TimelineStep[] => {
  let cumulativeHours = 0;
  
  return steps.map((step) => {
    const maxHours = getMaxHours(step.duration);
    cumulativeHours += maxHours;
    
    // Create a new step with the updated duration
    return {
      ...step,
      duration: `${cumulativeHours} hours`
    };
  });
};

export function Timeline({ steps }: TimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const normalizedSteps = normalizeDurations(steps);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="relative max-w-5xl mx-auto py-8">
      {/* Vertical line */}
      <div className="absolute left-[120px] top-0 bottom-0 w-0.5 bg-[#dbdbd9]/20" />
      
      {normalizedSteps.map((step) => {
        return (
          <div key={step.id} className="relative mb-10">
            <div className="flex items-start">
              {/* Duration on the left */}
              <div className="w-[120px] pr-6 text-right">
                <div className="text-sm font-medium text-[#dbdbd9]">
                  {step.duration}
                </div>
              </div>
              
              {/* Circle indicator */}
              <div className="absolute left-[120px] transform -translate-x-1/2 mt-1.5">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 border-[#dbdbd9]",
                  expandedSteps.has(step.id) ? "bg-[#dbdbd9]" : "bg-[#191a1a]"
                )} />
              </div>
              
              {/* Content on the right */}
              <div className="flex-1 pl-8">
                <Collapsible>
                  <CollapsibleTrigger
                    onClick={() => toggleStep(step.id)}
                    className="flex items-center space-x-2 text-lg font-semibold tracking-tight text-[#dbdbd9] hover:text-white w-full text-left"
                  >
                    <span>{step.title}</span>
                    {expandedSteps.has(step.id) ? (
                      <ChevronUp className="h-5 w-5 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 ml-2" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="mt-4 space-y-4">
                      <p className="text-[#dbdbd9] leading-relaxed">{step.description}</p>
                      
                      <div className="space-y-3">
                        {step.subSteps.map((subStep, subIndex) => (
                          <div key={subIndex} className="flex items-start space-x-2">
                            <span className="font-medium text-[#dbdbd9] mt-0.5">{subIndex + 1}.</span>
                            <div 
                              className="text-[#dbdbd9] leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: formatSubStep(subStep) }}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-4 mt-6">
                        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-[#202323] text-[#dbdbd9] rounded-md hover:bg-[#202323]/80 font-medium transition-colors">
                          <Book className="h-4 w-4" />
                          <span>Learning Materials</span>
                        </button>
                        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-[#202323] text-[#dbdbd9] rounded-md hover:bg-[#202323]/80 font-medium transition-colors">
                          <Code className="h-4 w-4" />
                          <span>Code Examples</span>
                        </button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 