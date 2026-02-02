import { GoogleGenAI } from "@google/genai";

export async function visualizeRoof(
  base64Image: string,
  material: string,
  model: string,
  color: string,
  gutterColor: string
): Promise<string | null> {
  try {
    // Mindig új példányt hozunk létre az aktuális API kulccsal
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Modernize this house roof. 
    1. Replace the existing roof material with exactly ${material} tiles, specifically reproducing the geometry and pattern of the "${model}" model style.
    2. Apply ${color} color to the tiles with a strict MATT finish (no gloss, no reflections).
    3. Change all rain gutters and downspouts to have a matching ${gutterColor} color.
    Ensure the building architecture, walls, and surroundings remain exactly the same. The visualization must be professional, photorealistic, and architectural quality. The new roof and gutters must fit perfectly onto the existing structure with zero distortion.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("AI Visualization Error:", error);
    return null;
  }
}