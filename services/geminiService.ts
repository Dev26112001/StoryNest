import { GoogleGenAI, Modality, Type } from '@google/genai';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. App may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateStoryIdeas(): Promise<Array<{ title: string; premise: string }>> {
  const prompt = `
    Generate a list of 18 unique, magical, and soothing bedtime story ideas for children aged 3-7.
    For each idea, provide a creative title and a short, one-sentence premise.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The creative title of the story.",
                  },
                  premise: {
                    type: Type.STRING,
                    description: "A short, one-sentence premise for the story.",
                  },
                },
                required: ['title', 'premise'],
              },
            },
          },
          required: ['ideas'],
        },
      },
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.ideas;

  } catch(error) {
    console.error("Error generating story ideas:", error);
    return [{ title: "The Bear Who Lost His Roar", premise: "A little bear searches the forest for his missing roar with the help of his friends." }];
  }
}

export async function generateStoryFromIdea(title: string, premise: string): Promise<{ title: string; text: string }> {
  const prompt = `
    Based on the title "${title}" and the premise "${premise}", write a complete, magical, and soothing bedtime story.
    The story should be around 200-300 words, have a clear beginning, middle, and a happy, calming end.
    It must be age-appropriate for a young child (3-7 years old).
    Do not use any complex words or scary themes.
    The response must be only the story text itself.
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const text = response.text.trim();

    if (!text) {
        throw new Error("Generated story is empty.");
    }

    return { title, text };
  } catch(error) {
    console.error("Error generating story from idea:", error);
    return { title: "A Little Hiccup", text: "Oh dear, it seems our storybook is a little stuck. The story couldn't be created right now. Let's try again in a moment!" };
  }
}

export async function generateStory(
  childName: string,
  character: string,
  theme: string
): Promise<{ title: string; text: string }> {
  const prompt = `
    Create a short, magical, and soothing bedtime story for a child named ${childName}.
    The main character should be a ${character}.
    The story should be about ${theme}.
    The story should be around 200-300 words, have a clear beginning, middle, and a happy, calming end.
    It must be age-appropriate for a young child (3-7 years old).
    Do not use any complex words or scary themes.
    The response must start with a title on the very first line, followed by the story content. For example:
    The Magical Adventure of Leo the Lion
    
    Once upon a time...
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const fullText = response.text;
    const lines = fullText.split('\n');
    const title = lines[0].trim();
    const text = lines.slice(1).join('\n').trim();

    if (!title || !text) {
        throw new Error("Generated story is not in the expected format.");
    }

    return { title, text };
  } catch(error) {
    console.error("Error generating story:", error);
    return { title: "A Little Hiccup", text: "Oh dear, it seems our storybook is a little stuck. The story couldn't be created right now. Let's try again in a moment!" };
  }
}

export async function generateSpeech(text: string, voice: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this story in a gentle, calming voice: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Audio data not found in response.");
    }
    return base64Audio;
}