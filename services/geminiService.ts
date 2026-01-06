
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchVideoIntelligence = async (url: string): Promise<Partial<VideoMetadata>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this YouTube URL: ${url}. Provide a summary of what the video is about and identify key topics discussed. Respond in professional JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            topics: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedDuration: { type: Type.STRING }
          },
          required: ["title", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      title: result.title,
      summary: result.summary,
      duration: result.estimatedDuration
    };
  } catch (error) {
    console.error("Gemini intelligence fetch failed:", error);
    return {};
  }
};

export const getSmartRecommendations = async (metadata: VideoMetadata): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the video title "${metadata.title}" and summary "${metadata.summary}", suggest 3 similar topics or related search terms the user might be interested in.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};
