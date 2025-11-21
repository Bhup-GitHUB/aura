import { PropertyInput } from "../types";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface PropertyAnalysisResult {
  fairMarketValueMin: number;
  fairMarketValueMax: number;
  confidenceScore: number;
  valuationStatus: "undervalued" | "fair" | "overvalued";
  summary: string;
  riskFactors: Array<{
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
  growthFactors: Array<{
    type: string;
    description: string;
    impact: "low" | "medium" | "high";
  }>;
  projected5yGrowthPercent: number;
  rentalYieldPercent: number;
  priceAdvantagePercent: number;
  livabilityScore: number;
  infrastructureScore: number;
  connectivityScore: number;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private model = "gemini-2.0-flash-001"; // Using specific version

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private buildAnalysisPrompt(property: PropertyInput): string {
    const priceInCr = (property.price / 10000000).toFixed(2);
    const pricePerSqft = (property.price / property.areaSqft).toFixed(2);

    return `You are an expert Indian real estate analyst specializing in Mumbai, Delhi, and Bangalore markets. 

Analyze the following property and provide a comprehensive valuation:

**Property Details:**
- Location: ${property.locality}, ${property.city}
- Type: ${property.propertyType}
- Price: ₹${priceInCr} Crore (₹${property.price.toLocaleString()})
- Area: ${property.areaSqft} sq ft
- Price per sq ft: ₹${pricePerSqft}
- Bedrooms: ${property.bedrooms || "N/A"}
- Bathrooms: ${property.bathrooms || "N/A"}
- Furnishing: ${property.furnishingStatus || "N/A"}
- Floor: ${property.floorNumber || "N/A"}/${property.totalFloors || "N/A"}
- Age: ${property.ageYears || "New"} years
${property.description ? `- Description: ${property.description}` : ""}

**Market Context:**
Consider typical ${property.city} market rates for ${
      property.locality
    }. Typical rates in this area range from ₹35,000-65,000 per sqft depending on amenities and exact location.

**Analysis Required:**
1. Fair market value range (minimum and maximum in rupees)
2. Valuation status (undervalued if 10%+ below market, overvalued if 10%+ above, otherwise fair)
3. Brief summary (2-3 sentences)
4. Top 3 risk factors with severity (low/medium/high)
5. Top 3 growth factors with impact (low/medium/high)
6. 5-year projected growth percentage
7. Expected rental yield percentage
8. Price advantage percentage (negative if above market, positive if below)
9. Livability score (0-10) considering amenities, location quality
10. Infrastructure score (0-10) for nearby facilities
11. Connectivity score (0-10) for transport access
12. Overall confidence score (0-10) in this analysis

**Output Format:**
Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "fairMarketValueMin": <number>,
  "fairMarketValueMax": <number>,
  "confidenceScore": <number 0-10>,
  "valuationStatus": "<undervalued|fair|overvalued>",
  "summary": "<string>",
  "riskFactors": [
    {"type": "<string>", "description": "<string>", "severity": "<low|medium|high>"}
  ],
  "growthFactors": [
    {"type": "<string>", "description": "<string>", "impact": "<low|medium|high>"}
  ],
  "projected5yGrowthPercent": <number>,
  "rentalYieldPercent": <number>,
  "priceAdvantagePercent": <number>,
  "livabilityScore": <number 0-10>,
  "infrastructureScore": <number 0-10>,
  "connectivityScore": <number 0-10>
}`;
  }

  async analyzeProperty(
    property: PropertyInput
  ): Promise<PropertyAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(property);

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;

      // Check for API errors in response
      if (data.error) {
        throw new Error(
          `Gemini API error: ${
            data.error.message || JSON.stringify(data.error)
          }`
        );
      }

      // Check if candidates exist and have content
      if (!data.candidates || data.candidates.length === 0) {
        console.error("No candidates in response:", JSON.stringify(data));
        throw new Error("No response from Gemini API - empty candidates");
      }

      const candidate = data.candidates[0];
      if (
        !candidate ||
        !candidate.content ||
        !candidate.content.parts ||
        candidate.content.parts.length === 0
      ) {
        console.error(
          "Invalid candidate structure:",
          JSON.stringify(candidate)
        );
        throw new Error("Invalid response structure from Gemini API");
      }

      const textResponse = candidate.content.parts[0].text;

      if (!textResponse) {
        console.error("No text in response:", JSON.stringify(candidate));
        throw new Error("No text content in Gemini API response");
      }

      // Clean up the response (remove markdown code blocks if present)
      let cleanedResponse = textResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, "");
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/\n?```$/g, "");
      }

      // Try to parse JSON
      let analysisResult: PropertyAnalysisResult;
      try {
        analysisResult = JSON.parse(cleanedResponse) as PropertyAnalysisResult;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response text:", cleanedResponse);
        throw new Error(
          `Failed to parse Gemini response as JSON: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`
        );
      }

      // Validate the result has required fields
      if (
        typeof analysisResult.fairMarketValueMin !== "number" ||
        typeof analysisResult.fairMarketValueMax !== "number"
      ) {
        console.error("Invalid analysis result:", analysisResult);
        throw new Error(
          "Invalid analysis result from Gemini - missing required fields"
        );
      }

      return analysisResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to analyze property: ${error.message}`);
      }
      throw new Error("Failed to analyze property: Unknown error");
    }
  }

  // Quick price check for simple analysis
  async getQuickPriceEstimate(
    city: string,
    locality: string,
    areaSqft: number,
    propertyType: string
  ): Promise<{ minPrice: number; maxPrice: number; confidence: number }> {
    try {
      const prompt = `As a real estate expert in ${city}, India, provide a quick price estimate for:
- Location: ${locality}, ${city}
- Area: ${areaSqft} sq ft
- Type: ${propertyType}

Respond ONLY with JSON (no markdown):
{
  "minPrice": <number in rupees>,
  "maxPrice": <number in rupees>,
  "confidence": <number 0-10>
}`;

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 256,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;

      // Check for API errors
      if (data.error) {
        throw new Error(
          `Gemini API error: ${
            data.error.message || JSON.stringify(data.error)
          }`
        );
      }

      // Validate response structure
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from Gemini API");
      }

      const candidate = data.candidates[0];
      if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
        throw new Error("Invalid response structure from Gemini API");
      }

      let textResponse = candidate.content.parts[0].text?.trim();

      if (!textResponse) {
        throw new Error("No text content in Gemini API response");
      }

      // Clean markdown
      textResponse = textResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      return JSON.parse(textResponse);
    } catch (error) {
      throw new Error("Failed to get price estimate");
    }
  }
}
