import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Existing image imports
import casual from '../assets/images/casual.jpg';
import formal from '../assets/images/formal.jpg';
import office from '../assets/images/office.jpg';
import party from '../assets/images/party.jpg';
import wedding from '../assets/images/wedding.jpg';
import sports from '../assets/images/sports.jpg';
import hot from '../assets/images/hot.jpg';
import cold from '../assets/images/cold.jpg';
import sunny from '../assets/images/sunny.jpg';
import rainy from '../assets/images/rain.jpg';
import cloudy from '../assets/images/cloudy.jpg';
import minimal from '../assets/images/minimal.jpg';
import bohemian from '../assets/images/bohemian.jpg';
import sporty from '../assets/images/sporty.jpg';
import urban from '../assets/images/urban.jpg';
import formal1 from '../assets/images/formal1.jpg';
import casual1 from '../assets/images/casual1.jpg';
import white from '../assets/images/white.jpg';
import black from '../assets/images/black.png';
import red from '../assets/images/red.jpg';
import green from '../assets/images/green.jpg';
import blue from '../assets/images/blue.jpg';
import pastel from '../assets/images/pastel.png';
import neutral from '../assets/images/netural.jpg';
import male from '../assets/images/male.jpg';
import female from '../assets/images/femal.jpg'; // Fixed typo
import unisex from '../assets/images/unisex.jpg';

// New image imports for currentOutfit (add to src/assets/images/)
import tshirt from '../assets/images/tshirt.jpg';
import shirt from '../assets/images/shirt.jpg';
import blouse from '../assets/images/blouse.jpg';
import jeans from '../assets/images/jeans.jpg';
import trousers from '../assets/images/trouser.jpg';
import skirt from '../assets/images/skirt.jpg';
import sneakers from '../assets/images/sneakers.jpg';
import boots from '../assets/images/boots.jpg';
import heels from '../assets/images/heels.jpg';

const RecommendationForm = ({ onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    occasion: '',
    weather: '',
    style: '',
    color: '',
    gender: '',
    age: '',
    currentOutfit: {
      topwear: { type: '', color: '' },
      bottomwear: { type: '', color: '' },
      footwear: { type: '', color: '' },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Define options with image paths
  const options = {
    occasion: [
      { value: 'casual', label: 'Casual', image: casual },
      { value: 'formal', label: 'Formal', image: formal },
      { value: 'business', label: 'Business', image: office },
      { value: 'party', label: 'Party', image: party },
      { value: 'wedding', label: 'Wedding', image: wedding },
      { value: 'sports', label: 'Sports', image: sports },
    ],
    weather: [
      { value: 'sunny', label: 'Sunny', image: sunny },
      { value: 'rainy', label: 'Rainy', image: rainy },
      { value: 'cloudy', label: 'Cloudy', image: cloudy },
      { value: 'cold', label: 'Cold', image: cold },
      { value: 'hot', label: 'Hot', image: hot },
    ],
    style: [
      { value: 'minimal', label: 'Minimal', image: minimal },
      { value: 'casual', label: 'Casual', image: casual1 },
      { value: 'formal', label: 'Formal', image: formal1 },
      { value: 'bohemian', label: 'Bohemian', image: bohemian },
      { value: 'sporty', label: 'Sporty', image: sporty },
      { value: 'urban', label: 'Urban', image: urban },
    ],
    color: [
      { value: 'blue', label: 'Blue', image: blue },
      { value: 'black', label: 'Black', image: black },
      { value: 'white', label: 'White', image: white },
      { value: 'red', label: 'Red', image: red },
      { value: 'green', label: 'Green', image: green },
      { value: 'neutral', label: 'Neutral', image: neutral },
      { value: 'pastel', label: 'Pastel', image: pastel },
    ],
    gender: [
      { value: 'male', label: 'Male', image: male },
      { value: 'female', label: 'Female', image: female },
      { value: 'unisex', label: 'Unisex', image: unisex },
    ],
    topwearTypes: [
      { value: 't-shirt', label: 'T-Shirt', image: tshirt },
      { value: 'shirt', label: 'Shirt', image: shirt },
      { value: 'blouse', label: 'Blouse', image: blouse },
    ],
    bottomwearTypes: [
      { value: 'jeans', label: 'Jeans', image: jeans },
      { value: 'trousers', label: 'Trousers', image: trousers },
      { value: 'skirt', label: 'Skirt', image: skirt },
    ],
    footwearTypes: [
      { value: 'sneakers', label: 'Sneakers', image: sneakers },
      { value: 'boots', label: 'Boots', image: boots },
      { value: 'heels', label: 'Heels', image: heels },
    ],
  };

  const handleImageSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOutfitChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentOutfit: {
        ...prev.currentOutfit,
        [category]: {
          ...prev.currentOutfit[category],
          [field]: value,
        },
      },
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { occasion, weather, style, color, gender, age, currentOutfit } = formData;
      const { topwear, bottomwear, footwear } = currentOutfit;
      const { type: topwearType, color: topwearColor } = topwear;
      const { type: bottomwearType, color: bottomwearColor } = bottomwear;
      const { type: footwearType, color: footwearColor } = footwear;

      const submissionData = {
        occasion,
        weather,
        style: style || 'casual',
        color: color || 'neutral',
        gender: gender || 'unisex',
        age: age || 'adult',
        currentOutfit: {
          topwear: { type: topwearType, color: topwearColor },
          bottomwear: { type: bottomwearType, color: bottomwearColor },
          footwear: { type: footwearType, color: footwearColor },
        },
      };

      await onSubmit(submissionData);
    } catch (err) {
      setError(err.message || 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageOptions = (name, optionsList, category, field) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {optionsList.map((opt) => (
        <motion.div
          key={opt.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            category && field
              ? handleOutfitChange(category, field, opt.value)
              : handleImageSelect(name, opt.value)
          }
          className={`relative rounded-lg overflow-hidden shadow cursor-pointer ${
            (category && formData.currentOutfit[category][field] === opt.value) ||
            (!category && formData[name] === opt.value)
              ? 'ring-2 ring-blue-500'
              : 'ring-1 ring-gray-300'
          } ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
        >
          <img
            src={opt.image}
            alt={opt.label}
            className="w-full h-32 object-cover"
            onError={(e) => (e.target.src = '/assets/images/fallback.jpg')}
          />
          <div className="p-2 text-center">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {opt.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Occasion
                </label>
                {renderImageOptions('occasion', options.occasion)}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Weather
                </label>
                {renderImageOptions('weather', options.weather)}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Style Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Style
                </label>
                {renderImageOptions('style', options.style)}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Color Preference
                </label>
                {renderImageOptions('color', options.color)}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Gender
                </label>
                {renderImageOptions('gender', options.gender)}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) => handleImageSelect('age', e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your age"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Current Outfit</h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Topwear Type
                </label>
                {renderImageOptions('topwear', options.topwearTypes, 'topwear', 'type')}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Topwear Color
                </label>
                {renderImageOptions('topwear', options.color, 'topwear', 'color')}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Bottomwear Type
                </label>
                {renderImageOptions('bottomwear', options.bottomwearTypes, 'bottomwear', 'type')}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Bottomwear Color
                </label>
                {renderImageOptions('bottomwear', options.color, 'bottomwear', 'color')}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Footwear Type
                </label>
                {renderImageOptions('footwear', options.footwearTypes, 'footwear', 'type')}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Footwear Color
                </label>
                {renderImageOptions('footwear', options.color, 'footwear', 'color')}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
    >
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s <= step ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-zinc-900 rounded hover:bg-zinc-300 hover:text-black"
          >
            Previous
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={
              step === 1
                ? !formData.occasion || !formData.weather
                : step === 2
                ? !formData.style || !formData.color
                : step === 3
                ? !formData.gender || !formData.age
                : false
            }
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white urna rounded hover:bg-green-600"
            disabled={
              isLoading ||
              !formData.currentOutfit.topwear.type ||
              !formData.currentOutfit.topwear.color ||
              !formData.currentOutfit.bottomwear.type ||
              !formData.currentOutfit.bottomwear.color ||
              !formData.currentOutfit.footwear.type ||
              !formData.currentOutfit.footwear.color
            }
          >
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
    </motion.div>
  );
};

export default RecommendationForm;