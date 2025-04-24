const asyncHandler = require('express-async-handler');
const { getRecommendation,friendChatAi } = require('../services/recommendationService');
const User = require('../models/User');

// @desc    Get outfit recommendation
// @route   POST /api/v1/recommendations
// @access  Private
exports.getRecommendation = async (req, res) => {
  try {
    const { weather, occasion, location } = req.body;
    const userId = req.user?.id; // Optional user ID

    if (!weather || !occasion) {
      return res.status(400).json({
        success: false,
        error: 'Weather and occasion are required'
      });
    }

    const recommendation = await getRecommendation(
      userId || 'anonymous',
      weather,
      occasion,
      location
    );

    // Save recommendation to user history if user is authenticated
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.recommendations.push({
          weather,
          occasion,
          location,
          recommendation,
          createdAt: new Date()
        });
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Get Recommendation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recommendation'
    });
  }
};

// @desc    Get user's recommendation history
// @route   GET /api/v1/recommendations/history
// @access  Private
exports.getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('recommendations');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.recommendations
    });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation history'
    });
  }
};

// @desc    Provide feedback on a recommendation
// @route   POST /api/v1/recommendations/:id/feedback
// @access  Private
exports.provideFeedback = async (req, res) => {
  try {
    const { recommendationId, feedback } = req.body;
    const userId = req.user.id;

    if (!recommendationId || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Recommendation ID and feedback are required'
      });
    }

    const updatedRecommendation = await getRecommendation(
      userId,
      recommendationId,
      feedback
    );

    res.status(200).json({
      success: true,
      data: updatedRecommendation
    });
  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save feedback'
    });
  }
};

// @desc    Get personalized style insights
// @route   GET /api/v1/recommendations/insights
// @access  Private
exports.getStyleInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Analyze user's recommendation history and feedback
    const insights = {
      mostCommonOccasions: {},
      preferredWeatherConditions: {},
      averageFeedbackScore: 0,
      totalRecommendations: user.recommendations.length,
      feedbackCount: 0
    };

    user.recommendations.forEach(rec => {
      // Track occasions
      insights.mostCommonOccasions[rec.occasion] = 
        (insights.mostCommonOccasions[rec.occasion] || 0) + 1;

      // Track weather conditions
      insights.preferredWeatherConditions[rec.weather] = 
        (insights.preferredWeatherConditions[rec.weather] || 0) + 1;

      // Calculate feedback score
      if (rec.feedback) {
        insights.feedbackCount++;
        insights.averageFeedbackScore += rec.feedback.rating || 0;
      }
    });

    // Calculate averages
    if (insights.feedbackCount > 0) {
      insights.averageFeedbackScore = 
        (insights.averageFeedbackScore / insights.feedbackCount).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Style Insights Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate style insights'
    });
  }
};

// Helper methods for style insights
exports.analyzeStylePreferences = (recommendations) => {
  const styleCounts = {};
  recommendations.forEach(rec => {
    const style = rec.outfit.style_reason;
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  });
  return Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};

exports.analyzeBrandPreferences = (recommendations) => {
  const brandCounts = {};
  recommendations.forEach(rec => {
    const brands = [
      rec.outfit.topwear?.brand,
      rec.outfit.bottomwear?.brand,
      rec.outfit.footwear?.brand,
      ...(rec.outfit.accessories?.brands || [])
    ].filter(Boolean);
    
    brands.forEach(brand => {
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
  });
  return Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};

exports.calculateAverageRating = (recommendations) => {
  const ratedRecommendations = recommendations.filter(rec => rec.feedback?.rating);
  if (ratedRecommendations.length === 0) return 0;
  
  const totalRating = ratedRecommendations.reduce(
    (sum, rec) => sum + rec.feedback.rating,
    0
  );
  return totalRating / ratedRecommendations.length;
};

exports.analyzeWeatherPreferences = (recommendations) => {
  const weatherCounts = {};
  recommendations.forEach(rec => {
    weatherCounts[rec.weather] = (weatherCounts[rec.weather] || 0) + 1;
  });
  return Object.entries(weatherCounts)
    .sort((a, b) => b[1] - a[1]);
};

exports.analyzeOccasionPreferences = (recommendations) => {
  const occasionCounts = {};
  recommendations.forEach(rec => {
    occasionCounts[rec.occasion] = (occasionCounts[rec.occasion] || 0) + 1;
  });
  return Object.entries(occasionCounts)
    .sort((a, b) => b[1] - a[1]);
};

// @desc    Get accessory recommendations
// @route   POST /api/recommendations
// @access  Private
const getAccessoryRecommendations = asyncHandler(async (req, res) => {
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
  } = req.body;

  // Validate required fields
  if (!occasion || !weather) {
    return res.status(400).json({
      success: false,
      error: 'Occasion and weather are required fields'
    });
  }

  try {
    // Format the current outfit for the prompt
    const formattedOutfit = currentOutfit 
      ? `${currentOutfit.topwear.type} (${currentOutfit.topwear.color}), ${currentOutfit.bottomwear.type} (${currentOutfit.bottomwear.color}), ${currentOutfit.footwear.type} (${currentOutfit.footwear.color})`
      : 'Not specified';

    const recommendation = await getRecommendation(
      {
        occasion,
        weather,
        style: style || 'casual',
        color: color || 'neutral',
        budget: budget || 'medium',
        gender: gender || 'unisex',
        age: age || 'adult',
        bodyType: bodyType || 'average',
        skinTone: skinTone || 'medium',
        personalStyle: personalStyle || 'classic',
        currentOutfit: formattedOutfit
      },
      req.user
    );

    res.json({
      success: true,
      data: recommendation,
      metadata: {
        timestamp: new Date().toISOString(),
        parameters: {
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
          currentOutfit: formattedOutfit
        }
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recommendations'
    });
  }
});




const GETfriendChatAi = async(req,res)=>{
  const {message} = req.body;
  try{
    let response = await friendChatAi(message);
    console.log(response);
    res.status(200).json({
      success:true,
      data:response
    });

  }catch(err){
    res.status(500).json({
      success:false,
      error:err.message || 'Failed to get response'
    });
  }
}


module.exports = {
  getAccessoryRecommendations,
  GETfriendChatAi
}; 