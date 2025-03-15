'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Code, X } from 'lucide-react';
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
  // First, try to extract just a number (e.g., "4 hours" or "10 hours")
  const simpleMatch = duration.match(/^(\d+)\s*hours?$/i);
  if (simpleMatch) {
    return parseInt(simpleMatch[1]);
  }
  
  // Try to extract numbers from the duration string with more complex patterns
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
  
  // Try to extract just a number as a last resort
  const justNumber = duration.match(/(\d+)/);
  if (justNumber) {
    return parseInt(justNumber[1]);
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

// Function to extract learning materials from substeps
const extractLearningMaterials = (subSteps: string[]): { title: string; url: string; description: string }[] => {
  const materials: { title: string; url: string; description: string }[] = [];
  
  subSteps.forEach(subStep => {
    // Look for markdown links with "Resource:" prefix
    const resourceMatch = subStep.match(/Resource:\s*\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/);
    if (resourceMatch) {
      materials.push({
        title: resourceMatch[1],
        url: resourceMatch[2],
        description: resourceMatch[3] || ''
      });
    }
  });
  
  return materials;
};

// Function to extract code examples from substeps
const extractCodeExamples = (subSteps: string[]): { title: string; code: string }[] => {
  const examples: { title: string; code: string }[] = [];
  
  subSteps.forEach(subStep => {
    // Look for "Practice exercise:" or "Project component:" prefixes
    if (subStep.startsWith('Practice exercise:') || subStep.startsWith('Project component:')) {
      const title = subStep.startsWith('Practice exercise:') 
        ? 'Practice Exercise' 
        : 'Project Component';
      const code = subStep.replace(/^(Practice exercise:|Project component:)\s*/, '').trim();
      
      examples.push({
        title,
        code
      });
    }
  });
  
  return examples;
};

// Modal component for displaying content
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202323] rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#dbdbd9]/10">
          <h3 className="text-lg font-medium text-[#dbdbd9]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#dbdbd9]/60 hover:text-[#dbdbd9] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export function Timeline({ steps }: TimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    type: 'materials' | 'code';
    title: string;
    step: TimelineStep | null;
  }>({
    isOpen: false,
    type: 'materials',
    title: '',
    step: null
  });
  
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
  
  const openMaterialsModal = (step: TimelineStep) => {
    setModalContent({
      isOpen: true,
      type: 'materials',
      title: `Learning Materials: ${step.title}`,
      step
    });
  };
  
  const openCodeModal = (step: TimelineStep) => {
    setModalContent({
      isOpen: true,
      type: 'code',
      title: `Code Examples: ${step.title}`,
      step
    });
  };
  
  const closeModal = () => {
    setModalContent({
      ...modalContent,
      isOpen: false
    });
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
                        <button 
                          onClick={() => openMaterialsModal(step)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#202323] text-[#dbdbd9] rounded-md hover:bg-[#202323]/80 font-medium transition-colors"
                        >
                          <Book className="h-4 w-4" />
                          <span>Learning Materials</span>
                        </button>
                        <button 
                          onClick={() => openCodeModal(step)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#202323] text-[#dbdbd9] rounded-md hover:bg-[#202323]/80 font-medium transition-colors"
                        >
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
      
      {/* Learning Materials Modal */}
      <Modal 
        isOpen={modalContent.isOpen && modalContent.type === 'materials'} 
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.step && (
          <div className="space-y-6">
            {extractLearningMaterials(modalContent.step.subSteps).length > 0 ? (
              extractLearningMaterials(modalContent.step.subSteps).map((material, index) => (
                <div key={index} className="bg-[#191a1a] p-4 rounded-md">
                  <h4 className="text-[#dbdbd9] font-medium mb-2">
                    <a 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex items-center gap-1"
                    >
                      {material.title}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 ml-1">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </h4>
                  {material.description && (
                    <p className="text-[#dbdbd9]/70 text-sm">{material.description}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#dbdbd9]/60">No learning materials found for this step.</p>
                <p className="text-[#dbdbd9]/40 text-sm mt-2">Try checking the links in the step description.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      {/* Code Examples Modal */}
      <Modal 
        isOpen={modalContent.isOpen && modalContent.type === 'code'} 
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.step && (
          <div className="space-y-6">
            {extractCodeExamples(modalContent.step.subSteps).length > 0 ? (
              extractCodeExamples(modalContent.step.subSteps).map((example, index) => (
                <div key={index} className="bg-[#191a1a] rounded-md overflow-hidden">
                  <div className="bg-[#202323] px-4 py-2 border-b border-[#dbdbd9]/10">
                    <h4 className="text-[#dbdbd9] font-medium">{example.title}</h4>
                  </div>
                  <div className="p-4">
                    <pre className="text-[#dbdbd9]/90 text-sm whitespace-pre-wrap font-mono">{example.code}</pre>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#dbdbd9]/60">No code examples found for this step.</p>
                <p className="text-[#dbdbd9]/40 text-sm mt-2">Try expanding the step to see all instructions.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 