import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Screening, TriageResult, HealthResource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const getPreventiveCarePlan = async (profile: UserProfile): Promise<Screening[]> => {
  const prompt = `
    Generate a list of preventive health screenings for a user with the following profile:
    Age: ${profile.age}
    Gender: ${profile.gender}
    Existing Conditions: ${profile.conditions.join(', ') || 'None'}

    Based on standard medical guidelines (like USPSTF), recommend 5-8 screenings.
    Return a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              frequency: { type: Type.STRING },
              reason: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Critical', 'Routine', 'Optional'] }
            },
            required: ['name', 'frequency', 'reason', 'category']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching preventive care:", error);
    return [];
  }
};

export const analyzeSymptoms = async (symptoms: string, profile: UserProfile): Promise<TriageResult | null> => {
  const prompt = `
    Act as a medical triage assistant. The user is a ${profile.age} year old ${profile.gender} with history of ${profile.conditions.join(', ')}.
    Symptoms: "${symptoms}"

    Analyze the severity.
    1. Determine urgency: 'Emergency' (life threatening), 'Urgent Care' (needs attention today), 'Virtual Visit' (consultation needed), or 'Self-Care' (monitor at home).
    2. Provide a brief summary of what might be happening (non-diagnostic).
    3. List 3 concrete actionable steps.
    4. Include a mandatory disclaimer.

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgencyLevel: { type: Type.STRING, enum: ['Emergency', 'Urgent Care', 'Virtual Visit', 'Self-Care'] },
            summary: { type: Type.STRING },
            actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING }
          },
          required: ['urgencyLevel', 'summary', 'actionableSteps', 'disclaimer']
        }
      }
    });

    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    return null;
  }
};

export const searchHealthResources = async (query: string): Promise<HealthResource[]> => {
  const prompt = `
    You are a helpful health librarian. Provide 3 distinct resource cards for the health topic: "${query}".
    Each resource should explain a specific aspect (e.g., Diet, Exercise, Treatment, or General Overview).
    Keep language simple (Grade 8 reading level).
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
              relatedTags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['topic', 'summary', 'keyAdvice', 'relatedTags']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error searching resources:", error);
    return [];
  }
};