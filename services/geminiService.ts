
import { GoogleGenAI, Type } from "@google/genai";

// As per platform requirements, the API key is injected via process.env.API_KEY.
// This will be defined by the Vite build process (see vite.config.ts)
const GEMINI_API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | undefined;
if (GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
} else {
    console.error("CRITICAL: API_KEY environment variable is not defined. The application's core functionality will not work. Please ensure the API_KEY is configured in your environment.");
}

export const extractItemsFromImage = async (base64Image: string, mimeType: string) => {
  if (!ai) {
    const errorMessage = "La API Key de Gemini no está configurada. La funcionalidad de escaneo está deshabilitada.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
    
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const prompt = `
      You are an expert OCR system for Chilean restaurant receipts.
      The currency is Chilean Pesos (CLP). Prices are integers and do not use decimals.
      Any dots (.) in prices are thousand separators and should be ignored (e.g., '1.500' is 1500).
      Any commas (,) in prices are decimal separators and the numbers after them should be ignored.
      Analyze the provided image of a receipt. Extract each line item and its corresponding price as a whole number (integer).
      - Only include items that are food or drinks.
      - Ignore taxes, tips, totals, discounts, and any other summary lines.
      - Ensure prices are valid numerical integer values. If a price is unclear, estimate it as 0.
      - Provide the output as a JSON object that adheres to the provided schema.
      - If no items are found, return an empty array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the item.",
              },
              price: {
                type: Type.INTEGER,
                description: "The price of the item as a whole number (integer).",
              },
            },
            required: ["name", "price"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation of the result
    if (Array.isArray(result)) {
        return result.filter(item => typeof item.name === 'string' && typeof item.price === 'number');
    }

    return [];
  } catch (error) {
    console.error("Error processing bill with Gemini:", error);
    // Re-throw the error so the UI can catch it and display a message
    if (error instanceof Error) {
        throw new Error(`Error al procesar la boleta con Gemini: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al procesar la boleta.');
  }
};
