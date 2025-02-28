import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the URL parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    // Ensure the user is requesting their own learning paths
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Fetch the user's learning paths
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
} 