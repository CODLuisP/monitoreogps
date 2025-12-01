import { GoogleGenAI, Type } from "@google/genai";
import { Unit } from "../types";

// Initialize Gemini Client
// NOTE: In a real production app, ensure API_KEY is set in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFleetStatus = async (units: Unit[], routeName: string | null) => {
  if (!process.env.API_KEY) {
    return {
      summary: "API Key not configured. Using simulated analysis.",
      alerts: ["System check required"]
    };
  }

  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are a fleet management assistant. Analyze the following vehicle data for ${routeName || 'All Routes'}.
    Provide a concise summary in Spanish (max 2 sentences) and a list of important alerts (e.g., speeding > 60km/h, offline units, or unusual stops).
    
    Data: ${JSON.stringify(units.map(u => ({ 
      plate: u.plate, 
      speed: u.speed, 
      status: u.status, 
      lastReport: u.lastReport 
    })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            alerts: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "alerts"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "No se pudo generar el análisis en este momento.",
      alerts: []
    };
  }
};