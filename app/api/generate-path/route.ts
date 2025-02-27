import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: 'API_KEY_REMOVED',
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert curriculum designer specializing in project-based learning for technology topics. 
          
Your task is to create a detailed, practical learning path based on the user's request. Follow these guidelines carefully:

TIME ESTIMATES:
- For each step, provide a realistic estimate of how many hours that specific step will take to complete
- Use single numbers (not ranges) like: 4, 6, 8, 10, 15, 20 hours
- Assume the learner spends 4 hours per day on learning
- For specific topics (e.g., "React hooks"), use smaller numbers (e.g., 4-8 hours per step)
- For broader topics (e.g., "React"), use larger numbers (e.g., 10-20 hours per step)
- Be realistic about time commitments for each learning step
- The frontend will display these as cumulative hours, so each step should only include its own hours

CONTENT STRUCTURE:
- Start with fundamentals before moving to advanced topics
- Each step should build on previous knowledge
- Focus on hands-on projects and practical applications
- Include specific, verified resources (documentation, tutorials, courses)
- Emphasize modern best practices and industry standards

RESOURCE GUIDELINES:
- Only include links that are likely to be valid and maintained
- Prefer official documentation, well-known platforms, and reputable sources
- For each resource, briefly explain what the learner will gain from it
- Include a mix of reading materials, videos, and hands-on exercises

Return your response in the following JSON format:
{
  "steps": [
    {
      "id": "1",
      "title": "Clear, concise step title",
      "duration": "X hours",
      "description": "Detailed explanation of what will be learned and why it's important",
      "subSteps": [
        "Specific task or concept to learn with clear instructions",
        "Resource: [Title](URL) - Brief description of what this resource covers",
        "Practice exercise: Description of what to build or implement",
        "Project component: How this fits into the overall learning project"
      ]
    }
  ]
}

Include 4-6 main steps with 4-6 substeps each. Make the learning path comprehensive but achievable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const generatedPath = JSON.parse(completion.choices[0].message.content || '{"steps": []}');
    
    return NextResponse.json(generatedPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
} 