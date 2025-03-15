import { NextResponse } from 'next/server';

// Define interface for the learning path step
interface LearningStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  subSteps: string[];
}

const apiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key (masked):', apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : 'undefined');
const FETCH_TIMEOUT = 15000; // Reduced to 15 seconds

/**
 * The `fetchWithTimeout` function in TypeScript allows fetching data from a URL with a specified
 * timeout duration.
 * @param {string} url - The `url` parameter in the `fetchWithTimeout` function is a string
 * representing the URL from which you want to fetch data.
 * @param {RequestInit} options - The `options` parameter in the `fetchWithTimeout` function represents
 * the configuration options for the fetch request. These options can include properties like `method`,
 * `headers`, `body`, `credentials`, `mode`, `cache`, `redirect`, and more. By spreading `...options`
 * in the
 * @returns The `fetchWithTimeout` function returns a Promise that resolves to the response from the
 * `fetch` request made to the specified URL with the provided options. If the request times out due to
 * the specified timeout duration, an error will be thrown.
 */
const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * The function POST asynchronously generates a detailed learning path based on user input by utilizing
 * the Gemini API and returns it in a specific JSON format.
 * @param {Request} req - The `POST` function you provided is an asynchronous function that handles a
 * POST request. It takes a `Request` object (`req`) as a parameter. Within the function, it processes
 * the request data, constructs a prompt based on the request, sends a request to the Gemini API with
 * the prompt,
 * @returns The `POST` function is returning the generated learning path in JSON format. The learning
 * path includes steps with titles, durations, descriptions, and substeps that contain specific tasks,
 * resources, practice exercises, and project components. The function handles errors by returning a
 * JSON object with an error message if there was an issue generating the learning path.
 */
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    // Changed the system prompt to be more concise 
    const systemPrompt = `Create a practical learning path with 4-6 steps. For each step include:

1. A clear title
2. Duration in hours (single number followed by the word "hours", e.g., "4 hours", "10 hours")
3. Brief description
4. 2-3 learning resources with markdown links formatted as: "Resource: [Title](URL) - Brief description"
5. 1-2 practice exercises formatted as: "Practice exercise: Description"

Return as JSON:
{
  "steps": [
    {
      "id": "1",
      "title": "Step title",
      "duration": "X hours",
      "description": "What will be learned",
      "subSteps": [
        "Resource: [Title](URL) - Description",
        "Practice exercise: Description"
      ]
    }
  ]
}

Make it practical and achievable.`;

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    const response = await fetchWithTimeout(
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
            temperature: 0.5, // Reduced for more focused responses
            maxOutputTokens: 2048, // Reduced for faster generation
            topP: 0.8, // Added for more focused responses
            topK: 40 // Added for more focused responses
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
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let generatedPath;
    
    if (jsonMatch) {
      try {
        generatedPath = JSON.parse(jsonMatch[0]);
        
        // Validate and ensure minimum required structure
        if (!generatedPath?.steps?.length) {
          throw new Error('Invalid learning path structure');
        }

        // Ensure each step has required fields
        generatedPath.steps = generatedPath.steps.map((step: Partial<LearningStep>, index: number) => ({
          id: step.id || String(index + 1),
          title: step.title || 'Untitled Step',
          duration: step.duration || '4 hours',
          description: step.description || 'No description provided',
          subSteps: Array.isArray(step.subSteps) ? step.subSteps : []
        }));

      } catch (e) {
        console.error('Error parsing JSON from Gemini response:', e);
        throw new Error('Failed to parse learning path data');
      }
    } else {
      throw new Error('Invalid response format from AI model');
    }

    return NextResponse.json(generatedPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const status = error instanceof Error && error.message.includes('abort') ? 504 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 