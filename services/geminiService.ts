
import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, GeminiVerificationResponse } from "../types";

export const verifyActionImage = async (
  base64Image: string,
  actionType: ActionType
): Promise<GeminiVerificationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a professional environmental officer for the "Help Ireland" initiative. 
  Examine the image to confirm if the user has performed the action: "${actionType}".
  
  Please provide your assessment in JSON format.
  - "verified": boolean (true if the action is confirmed)
  - "message": string (A professional, encouraging response in a clear Irish tone. Avoid stereotypes or colloquialisms like 'lad' or 'lass'. Focus on the positive impact on the Irish environment).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verified: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
          },
          required: ["verified", "message"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return {
      verified: false,
      message: "The verification system is currently unavailable. Please try again shortly.",
    };
  }
};
