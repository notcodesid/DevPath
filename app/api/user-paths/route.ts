import { NextResponse } from 'next/server';
import { getUser } from '@civic/auth/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the user from Civic Auth
    const user = await getUser();
    
    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch learning paths for the authenticated user
    const userPaths = await prisma.learningPath.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ paths: userPaths }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
} 