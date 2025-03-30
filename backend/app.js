const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// console.log(process.env.Chat);
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("🔑 API Keys Loaded:", !!HUGGING_FACE_API_KEY, !!OPENROUTER_API_KEY);
// Function to create the prompt
const createPrompt = (weather, occasion) => `
You are a senior fashion designer. Generate an outfit recommendation for ${weather} weather and a ${occasion} event.

### Rules:
- Provide only a valid JSON object with double quotes.
- No extra text before or after the JSON.
- Output format:
{
  "topwear": "[Item]",
  "bottomwear": "[Item]",
  "footwear": "[Item]",
  "accessories": "[Item1] and [Item2]",
  "style_reason": "[Concise explanation]"
}
`;

// Function to extract JSON content after "### OUTPUT:"
function extractJsonFromResponse(text) {
  try {
    console.log("🔍 Raw AI Response:", text);

    // Directly try to extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error("No valid JSON found");

    // Clean the JSON string by removing extra backslashes
    const cleanedJson = jsonMatch[0].replace(/\\/g, '');
    
    // Parse and return JSON
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("🚨 JSON Extraction Error:", error.message);
    return { error: "Invalid AI response format" };
  }
}

async function getOutfitRecommendation(weather, occasion) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324", // Ensure this is the correct model ID
        messages: [
          { role: "system", content: "You are an AI fashion assistant providing outfit recommendations." },
          { role: "user", content: createPrompt(weather, occasion) }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
        timeout: 10000
      }
    );

    console.log("🔍 AI Response:", response.data);
    return extractJsonFromResponse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("🚨 API Error:", error.response?.data || error.message);
    return { error: "AI service unavailable, try again later." };
  }
}

// API Endpoint to get outfit recommendations
app.post("/recommend", async (req, res) => {
  try {
    const { weather, occasion } = req.body;
    
    if (!weather || !occasion) {
      return res.status(400).json({
        error: "Missing required parameters: weather and occasion",
        example_request: { weather: "Rainy", occasion: "Business Meeting" }
      });
    }

    const recommendation = await getOutfitRecommendation(weather, occasion);
    
    res.json({
      recommendation: {
        ...recommendation,
        weather_conditions: weather.toLowerCase(),
        occasion_type: occasion.toLowerCase(),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("🚨 Server Error:", error);
    res.status(500).json({
      error: "Internal server error",
      recovery_suggestion: "Please try again in 30 seconds"
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "operational",
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    last_checked: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
