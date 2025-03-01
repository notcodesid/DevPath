import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, steps } = await req.json();

    if (!title || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Invalid learning path data' },
        { status: 400 }
      );
    }

    // Create a new learning path with a share ID
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        steps,
        description: `Learning path for ${title}`,
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