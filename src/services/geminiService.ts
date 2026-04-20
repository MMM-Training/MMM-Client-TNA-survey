import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const geminiModel = "gemini-3-flash-preview";

export async function generateSurveyBotMessage(
  stepIndex: number, 
  totalSteps: number, 
  sectionTitle: string, 
  userType: string | null, 
  role?: string
) {
  try {
    const prompt = `
      You are "Survey Bot", a friendly AI assistant helping a user complete a performance appraisal survey.
      Current Context:
      - Step: ${stepIndex + 1} of ${totalSteps}
      - Section Title: ${sectionTitle}
      - User Role in App: ${userType}
      - Specific VA Role being reviewed: ${role || "N/A"}

      Requirement:
      Generate a short, encouraging (1-2 sentences) message for the user that is context-aware.
      The tone should be professional yet warm. 
      If it's the first step, welcome them. 
      If it's the last step, thank them.
      Otherwise, provide a quick tip or encouragement related to the section title.
      Don't use markdown. Just plain text.
    `;

    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
    });

    return response.text?.trim() || "You're doing great! Keep going.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic if API fails or key is missing
    return null; 
  }
}

export async function analyzeSurveyResponses(responses: any[]) {
  try {
    const dataString = JSON.stringify(responses.slice(0, 10)); // Limit data for prompt size
    const prompt = `
      Analyze the following survey responses from a VA performance appraisal platform:
      ${dataString}

      Provide a high-level executive summary (3-4 bullet points) of the key insights, including:
      1. Overall sentiment or performance trends.
      2. Most common training needs or skill gaps.
      3. Any recurring challenges mentioned by clients or VAs.
      
      Format your response as a JSON object with a single key "summary" which is a string using markdown bullets.
    `;

    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{"summary": "No analysis available."}');
    return result.summary;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analysis unavailable at this time.";
  }
}
