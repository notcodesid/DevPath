import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OG Image Test',
  description: 'Test page for Open Graph image generation',
};

export default function OGTestPage() {
  // Sample titles to test
  const titles = [
    'How to build [id] based open graph same as perplexity',
    'Learning React from scratch',
    'Advanced TypeScript techniques for better code',
    'Building scalable Node.js applications',
    'DevOps best practices for modern applications'
  ];

  return (
    <div className="min-h-screen bg-[#151718] text-[#dbdbd9] p-8">
      <h1 className="text-2xl font-bold mb-6">Open Graph Image Test</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {titles.map((title, index) => {
          const encodedTitle = encodeURIComponent(title);
          const imageUrl = `/api/og?title=${encodedTitle}`;
          
          return (
            <div key={index} className="border border-[#303030] rounded-md p-4 bg-[#202323]">
              <h2 className="text-xl font-semibold mb-4">{title}</h2>
              <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-md border border-[#303030]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageUrl} 
                  alt={`Open Graph Preview for ${title}`} 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Image URL:</h3>
                <div className="bg-[#151718] p-2 rounded-md overflow-x-auto">
                  <code className="text-sm text-[#dbdbd9]">{imageUrl}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 