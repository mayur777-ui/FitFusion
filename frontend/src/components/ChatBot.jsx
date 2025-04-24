import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import RecommendationForm from './RecommendationForm';
import RecommendationDisplay from './RecommendationDisplay';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  useEffect(() => {
    const saved = localStorage.getItem('recommendation');
    if (saved) {
      setRecommendation(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (recommendation) {
      localStorage.setItem('recommendation', JSON.stringify(recommendation));
    } else {
      localStorage.removeItem('recommendation');
    }
  }, [recommendation]);
  const handleGetRecommendations = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/recommend/recommend', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setRecommendation(response.data);
      } else {
        throw new Error(response.data.message || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError(error.response?.data?.message || error.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation Bar */}
      <nav className={`p-4 border-b ${isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/icon.png" alt="Fashion AI Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">StyleGenius AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Logout
            </button>
              </div>
      </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : recommendation ? (
          <div className="space-y-8">
            <RecommendationDisplay recommendation={recommendation} />
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setRecommendation(null);
                  setError('');
                }}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Get New Recommendations
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Get Personalized Accessory Recommendations</h2>
            <RecommendationForm onSubmit={handleGetRecommendations} isLoading={isLoading} />
          </div>
        )}
      </main>
      </div>
  );
};

export default ChatBot;