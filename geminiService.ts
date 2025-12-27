import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePotential = async (input: UserInput): Promise<AnalysisResult> => {
  const prompt = `
    Act as a professional German real estate expert and analyst (Immobilienbewertung).
    Analyze the rental potential for the following property:

    Address: ${input.address}
    Type: ${input.propertyType}
    Size: ${input.sizeSqm} sqm
    Rooms: ${input.rooms}
    Year Built: ${input.yearBuilt}
    Condition: ${input.condition}
    Current Cold Rent: ${input.currentColdRent} EUR

    Task:
    1. Estimate the current market cold rent (Marktmiete) based on the location (infer from address), condition, and year.
    2. Estimate the local "Mietspiegel" (rent index) range for this specific type of building in this city.
    3. Provide a brief analysis of the location quality (macro/micro location).
    4. Calculate the potential yearly financial gain if rent was adjusted to market level.

    Return the data strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedMarketRentPerSqm: { type: Type.NUMBER, description: "Estimated market price per square meter in EUR" },
            estimatedTotalMarketRent: { type: Type.NUMBER, description: "Total estimated cold rent per month in EUR" },
            mietspiegelMin: { type: Type.NUMBER, description: "Lower bound of local rent index per sqm" },
            mietspiegelMax: { type: Type.NUMBER, description: "Upper bound of local rent index per sqm" },
            comparableRentLow: { type: Type.NUMBER, description: "Lowest comparable rent in area (total)" },
            comparableRentHigh: { type: Type.NUMBER, description: "Highest comparable rent in area (total)" },
            locationAnalysis: { type: Type.STRING, description: "Short professional text (approx 30 words) analyzing the location quality." },
          },
          required: ["estimatedMarketRentPerSqm", "estimatedTotalMarketRent", "mietspiegelMin", "mietspiegelMax", "locationAnalysis", "comparableRentLow", "comparableRentHigh"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // Calculate derived fields on the client side to ensure accuracy relative to input
    const potentialMonthlyGain = Math.max(0, data.estimatedTotalMarketRent - input.currentColdRent);
    const potentialYearlyGain = potentialMonthlyGain * 12;
    const rentGapPercentage = input.currentColdRent > 0 
      ? ((data.estimatedTotalMarketRent - input.currentColdRent) / input.currentColdRent) * 100 
      : 0;

    return {
      estimatedMarketRentPerSqm: data.estimatedMarketRentPerSqm,
      estimatedTotalMarketRent: data.estimatedTotalMarketRent,
      mietspiegelMin: data.mietspiegelMin,
      mietspiegelMax: data.mietspiegelMax,
      locationAnalysis: data.locationAnalysis,
      comparableRentLow: data.comparableRentLow,
      comparableRentHigh: data.comparableRentHigh,
      potentialYearlyGain,
      rentGapPercentage: Math.max(0, rentGapPercentage)
    };

  } catch (error) {
    console.error("Error analyzing property:", error);
    throw new Error("Analysis failed. Please try again.");
  }
};
