import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, steps, userId } = await req.json();
    
    // Get the session to verify the user, but this is optional
    // Users can generate and save paths without authentication
    const session = await getServerSession(authOptions);
    
    // Verify that the userId matches the authenticated user or is undefined for anonymous users
    const authenticatedUserId = session?.user?.id;
    const finalUserId = userId && authenticatedUserId === userId ? userId : undefined;

    if (!title || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Invalid learning path data' },
        { status: 400 }
      );
    }

    // Create a new learning path with a share ID
    // If user is not authenticated, the path will be saved without a userId
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        steps,
        description: `Learning path for ${title}`,
        userId: finalUserId, // Will be undefined for anonymous users
      },
    });

    return NextResponse.json({
      success: true,
      shareId: learningPath.shareId,
      message: 'Learning path saved successfully',
    });
  } catch (error) {
    console.error('Error saving learning path:', error);
    return NextResponse.json(
      { error: 'Failed to save learning path' },
      { status: 500 }
    );
  }
} 