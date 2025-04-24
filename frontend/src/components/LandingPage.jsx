import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  SparklesIcon, 
  UserPlusIcon, 
  ArrowRightIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-full ${
          isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800'
        } shadow-lg hover:scale-110 transition-transform`}
      >
        {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <SparklesIcon className={`w-full h-full ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>StyleGenius</span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto">
            Your AI-powered fashion assistant for personalized accessory recommendations
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold ${
                  isDarkMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                } shadow-lg transition-colors`}
              >
                Login
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold ${
                  isDarkMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } shadow-lg transition-colors`}
              >
                Register
                <UserPlusIcon className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <motion.div
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
              <p>Get accessory suggestions tailored to your style, occasion, and weather conditions.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-xl font-semibold mb-3">Style Preferences</h3>
              <p>Save your style preferences for more accurate and consistent recommendations.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-xl font-semibold mb-3">Weather-Aware</h3>
              <p>Get recommendations that consider current weather conditions for optimal comfort.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 