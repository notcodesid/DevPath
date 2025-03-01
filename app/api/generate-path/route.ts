import { NextResponse } from 'next/server';

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key (masked):', apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : 'undefined');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    // Create the system prompt and user prompt
    const systemPrompt = `You are an expert curriculum designer specializing in project-based learning for technology topics. 
          
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
- IMPORTANT: For EACH step, include at least 2-3 specific learning resources with proper markdown links
- Format resources exactly as: "Resource: [Title](URL) - Brief description of what this resource covers"
- Only include links that are likely to be valid and maintained
- Prefer official documentation, well-known platforms, and reputable sources
- For each resource, briefly explain what the learner will gain from it
- Include a mix of reading materials, videos, and hands-on exercises

CODE EXAMPLES GUIDELINES:
- IMPORTANT: For EACH step, include at least 1-2 practice exercises or project components
- Format practice exercises exactly as: "Practice exercise: Description of what to build or implement"
- Format project components exactly as: "Project component: How this fits into the overall learning project"
- Be specific about what the learner should build or implement
- Include clear instructions and expected outcomes
- Suggest tools, libraries, or frameworks to use

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
        "Resource: [Another Title](URL) - Brief description of what this resource covers",
        "Practice exercise: Description of what to build or implement",
        "Project component: How this fits into the overall learning project"
      ]
    }
  ]
}

Include 4-6 main steps with 4-6 substeps each. Make the learning path comprehensive but achievable.`;

    // Combine system prompt and user prompt
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    // Make direct fetch request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse the JSON from the response
    // Find JSON content between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let generatedPath;
    
    if (jsonMatch) {
      try {
        generatedPath = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Error parsing JSON from Gemini response:', e);
        generatedPath = { steps: [] };
      }
    } else {
      console.error('No JSON found in Gemini response');
      generatedPath = { steps: [] };
    }

    return NextResponse.json(generatedPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
} 