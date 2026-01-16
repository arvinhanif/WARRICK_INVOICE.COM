
import { GoogleGenAI, Type } from "@google/genai";

// Standard practice for handling the API key in a secure yet static-friendly way
const getApiKey = () => {
  return process.env.API_KEY || '';
};

export const parseNaturalLanguageInvoice = async (prompt: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key missing. Natural language features will be unavailable.");
    return {};
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract invoice information from this text: "${prompt}". 
    Return a structured JSON object. 
    If data is missing, use sensible defaults or leave empty. 
    Current Date: ${new Date().toISOString().split('T')[0]}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING },
          currency: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                price: { type: Type.NUMBER }
              }
            }
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateProfessionalTerms = async (businessType: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "Professional terms generation requires an API Key.";

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate professional invoice payment terms and notes for a ${businessType} business. Keep it concise, polite, and iOS-style (modern/minimal).`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text;
};
