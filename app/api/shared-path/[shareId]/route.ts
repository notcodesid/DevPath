import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const shareId = (await params).shareId;

  if (!shareId) {
    return NextResponse.json(
      { error: 'Share ID is required' },
      { status: 400 }
    );
  }

  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: { shareId }
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(learningPath);
  } catch (error) {
    console.error('Error retrieving shared learning path:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared learning path' },
      { status: 500 }
    );
  }
} 