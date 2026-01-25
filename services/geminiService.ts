
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

export const verifyNeighborhood = async (
  county: string,
  neighborhood: string
): Promise<{ verified: boolean; message: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a geographic validator for the "Help Ireland" initiative.
  Verify if "${neighborhood}" is a legitimate neighborhood, townland, or village within County ${county}, Ireland.
  
  Respond in JSON format:
  - "verified": boolean
  - "message": string (A brief explanation of why it is or isn't valid, in a professional and helpful Irish tone).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Neighborhood Verification Error:", error);
    return {
      verified: false,
      message: "Unable to verify geographic data at this time.",
    };
  }
};

export const verifyStreet = async (
  county: string,
  neighborhood: string,
  street: string
): Promise<{ verified: boolean; message: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a geographic validator for the "Help Ireland" initiative.
  Verify if "${street}" is a legitimate street, road, or avenue within the neighborhood of "${neighborhood}", County ${county}, Ireland.
  
  Respond in JSON format:
  - "verified": boolean
  - "message": string (A brief explanation of why it is or isn't valid, in a professional and helpful Irish tone).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Street Verification Error:", error);
    return {
      verified: false,
      message: "Unable to verify street data at this time.",
    };
  }
};
