const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');


// Load environment variables from the project root
dotenv.config({ path: path.join(process.cwd(), '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// console.log('Environment variables:', {
//   OPENROUTER_API_KEY: OPENROUTER_API_KEY ? 'Set' : 'Not Set',
//   WEATHER_API_KEY: WEATHER_API_KEY ? 'Set' : 'Not Set'
// });

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
}
if (!WEATHER_API_KEY) {
  throw new Error('WEATHER_API_KEY is not configured in environment variables');
}

const generatePersonalizedPrompt = (userData, recommendationPrompt) => {
  const {
    occasion,
    weather,
    style,
    color,
    budget,
    gender,
    age,
    bodyType,
    skinTone,
    personalStyle,
    currentOutfit
  } = recommendationPrompt;

  const userPreferences = userData?.preferences || {};

  return `As a fashion expert, provide detailed accessory recommendations for:

Context:
- Occasion: ${occasion}
- Weather: ${weather}
- Style: ${style}
- Color Preference: ${color}
- Budget: ${budget}
- Gender: ${gender}
- Age: ${age}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Personal Style: ${personalStyle}
- Current Outfit: ${currentOutfit}

User Preferences:
- Favorite Colors: ${userPreferences.favoriteColors?.join(', ') || 'Not specified'}
- Style Preferences: ${userPreferences.stylePreferences?.join(', ') || 'Not specified'}
- Budget Range: ${userPreferences.budgetRange || 'Not specified'}
- Favorite Brands: ${userPreferences.favoriteBrands?.join(', ') || 'Not specified'}

Please provide:
1. A brief summary of the recommendation
2. 3-5 specific accessory recommendations with:
   - Type of accessory
   - Specific name/description
   - Price range
   - Where to buy
   - Styling tips
3. Outfit suggestions that complement the accessories
4. Color palette recommendations
5. Occasion-specific tips
6. Weather-appropriate considerations

Respond strictly in valid JSON format.`;
};

const getRecommendation = async (recommendationPrompt, userData) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const prompt = generatePersonalizedPrompt(userData, recommendationPrompt);

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist and accessory expert. Provide detailed, personalized accessory recommendations based on the given context and user preferences. Respond strictly in valid JSON format with the following structure: { summary: string, accessories: [{ type: string, name: string, description: string, priceRange: string, whereToBuy: string, stylingTips: string }], outfitSuggestions: [{ description: string }], colorPalette: string, occasionTips: string, weatherConsiderations: string }'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Remove markdown code block formatting if present
    const cleanedContent = content.replace(/^```json\s*|\s*```$/g, '').trim();

    let recommendation;
    try {
      recommendation = JSON.parse(cleanedContent);
      // console.log('Raw recommendation:', recommendation);
    } catch (parseError) {
      console.error('Failed to parse recommendation response:', cleanedContent);
      throw new Error('Invalid recommendation format');
    }

    // Ensure the response matches our expected format
    return {
      summary: recommendation?.summary || 'No summary available',
      accessories: (recommendation?.accessories || []).map(accessory => ({
        type: accessory?.type || 'Unknown type',
        name: accessory?.name || 'Unnamed accessory',
        description: accessory?.description || 'No description available',
        priceRange: accessory?.priceRange || 'Price not specified',
        whereToBuy: accessory?.whereToBuy || 'Not specified',
        stylingTips: accessory?.stylingTips || 'No styling tips available'
      })),
      outfitSuggestions: (recommendation?.outfitSuggestions || []).map(suggestion => ({
        description: suggestion?.description || 'No description available'
      })),
      colorPalette: recommendation?.colorPalette || 'No color palette available',
      occasionTips: recommendation?.occasionTips || 'No occasion tips available',
      weatherConsiderations: recommendation?.weatherConsiderations || 'No weather considerations available'
    };
  } catch (error) {
    console.error('Error generating recommendation:', error);
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw new Error('Failed to generate recommendation: ' + (error.message || 'Unknown error'));
  }
};

async function getWeatherData(location) {
  try {
    if (!WEATHER_API_KEY || !location) return null;

    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);

    if (!response.data || !response.data.main || !response.data.weather) return null;

    return {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity
    };
  } catch (error) {
    console.error('Weather fetch error:', error.response?.data || error.message);
    return null;
  }
}

async function saveUserFeedback(userId, recommendationId, feedback) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const recommendation = user.recommendations.id(recommendationId);
    if (!recommendation) throw new Error('Recommendation not found');

    recommendation.feedback = feedback;
    await user.save();

    return recommendation;
  } catch (error) {
    console.error('Feedback saving error:', error);
    throw error;
  }
}



const friendChatAi = async (userMessage) => {
  const prompt = userMessage;
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist and accessory expert. Provide detailed, personalized accessory recommendations based on the given context and user preferences. Respond strictly in valid JSON format with the following structure: { summary: string, accessories: [{ type: string, name: string, description: string, priceRange: string, whereToBuy: string, stylingTips: string }], outfitSuggestions: [{ description: string }], colorPalette: string, occasionTips: string, weatherConsiderations: string }'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log the full response for inspection
    // console.log('Full Response:', response.data);

    if (response.data.choices && response.data.choices.length > 0) {
      const raw = response.data.choices[0].message.content;
      const jsonString = raw.match(/```json\n([\s\S]*?)```/)?.[1];
      if (!jsonString) {
        throw new Error("Could not extract JSON from response");
      }
      const jsonData = JSON.parse(jsonString);
      // console.log('Parsed JSON:', jsonData);
      return jsonData;
    } else {
      console.log('No valid response received.');
    }

  } catch (error) {
    console.error('Error calling API:', error);
  }
};


module.exports = {
  getRecommendation,
  getWeatherData,
  saveUserFeedback,
  friendChatAi
};






