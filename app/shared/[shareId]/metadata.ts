import { Metadata } from 'next';

// Define the types for metadata generation
type Props = {
  params: { shareId: string };
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Fetch the learning path data
  const shareId = params.shareId;
  let title = 'DevPath Learning Path';
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/shared-path/${shareId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.path && data.path.title) {
        title = data.path.title;
      }
    }
  } catch (error) {
    console.error('Error fetching path for metadata:', error);
  }
  
  return {
    title,
    description: `Check out this learning path: ${title}`,
    openGraph: {
      title,
      description: `A personalized learning path for your development journey`,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `A personalized learning path for your development journey`,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
} 