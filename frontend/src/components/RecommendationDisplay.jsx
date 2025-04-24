import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiDroplet, FiUmbrella, FiStar, FiWatch, FiShoppingBag, FiInfo, FiCopy, FiSend, FiLoader, FiX } from 'react-icons/fi';
import { MessageSquare, Send,X } from 'lucide-react';
import { MdAutoAwesome } from 'react-icons/md';
import axios from 'axios';
const RecommendationDisplay = ({ recommendation }) => {
  const { isDarkMode } = useTheme();
  const [expandedAccessory, setExpandedAccessory] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showMessager,SetShowMessager] = useState(false);
  const parseColorPalette = (colorPalette) => {
    if (typeof colorPalette === 'string') {
      const colors = colorPalette.match(/\b(?:black|brown|blue|red|green|yellow|purple|pink|orange|gray|white)\b/gi) || [];
      return colors.map(color => color.toLowerCase());
    }
    return ['black', 'white'];
  };
  let toggelMessager = () =>{
    SetShowMessager(!showMessager);
  }
  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  if (!recommendation?.data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-8 rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}
      >
        <div className="text-center py-12">
          <p className="text-xl font-light text-gray-500">No recommendations available yet</p>
        </div>
      </motion.div>
    );
  }

  const { data } = recommendation;
  const accessories = Array.isArray(data.accessories) ? data.accessories : [];
  const outfitSuggestions = Array.isArray(data.outfitSuggestions) ? data.outfitSuggestions : [];
  const colors = parseColorPalette(data.colorPalette);


  const ShowChatfriend = ({ toggelMessager }) => {
    const [inputfriend, setInputfriend] = useState('');
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            content: "Hello! I'm StyleGenius 👋 How can I help you with fashion recommendations today?", 
            sent: false,
            isAI: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedColor, setCopiedColor] = useState(null);

    const handelChangefriend = (e) => setInputfriend(e.target.value);

    const parseColorPalette = (colorString) => {
        return colorString.match(/\b(\w+)\b/g) || [];
    };

    const copyColor = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const renderRecommendations = (data) => {
        const colors = parseColorPalette(data.colorPalette);
        
        return (
            <div className="space-y-4 text-sm">
                {/* Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <FiStar className="w-4 h-4" />
                        Style Summary
                    </h3>
                    <p>{data.summary}</p>
                </div>

                {/* Color Palette */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-600 dark:text-purple-300 mb-2 flex items-center gap-2">
                        <FiSun className="w-4 h-4" />
                        Color Story
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                                onClick={() => copyColor(color)}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg shadow-md cursor-pointer"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                                <AnimatePresence>
                                    {copiedColor === color && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full mt-1 left-0 bg-black text-white px-2 py-1 rounded text-xs"
                                        >
                                            Copied!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Accessories */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FiShoppingBag className="w-4 h-4" />
                        Essential Accessories
                    </h3>
                    <div className="grid gap-3">
                        {data.accessories.map((accessory, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                                        {accessory.type === 'Watch' && <FiWatch className="text-purple-600 w-5 h-5" />}
                                        {accessory.type === 'Belt' && <FiCopy className="text-purple-600 w-5 h-5" />}
                                        {accessory.type === 'Hat' && <FiUmbrella className="text-purple-600 w-5 h-5" />}
                                        {accessory.type === 'Sunglasses' && <FiSun className="text-purple-600 w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{accessory.name}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {accessory.description}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between text-xs">
                                            <span className="text-purple-600 dark:text-purple-400">
                                                {accessory.priceRange}
                                            </span>
                                            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                                Where to buy →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Occasion & Weather */}
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-600 dark:text-green-300 mb-2 flex items-center gap-2">
                            <FiInfo className="w-4 h-4" />
                            Occasion Tips
                        </h3>
                        <p>{data.occasionTips}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-600 dark:text-orange-300 mb-2 flex items-center gap-2">
                            <FiSun className="w-4 h-4" />
                            Weather Guide
                        </h3>
                        <p>{data.weatherConsiderations}</p>
                    </div>
                </div>
            </div>
        );
    };

    const FriendhandelOnSubmit = async () => {
        if (!inputfriend.trim()) return;
      
        try {
            const userMessage = {
                id: messages.length + 1,
                content: inputfriend,
                sent: true,
                isAI: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, userMessage]);
            setInputfriend('');
            setIsLoading(true);

            const response = await axios.post(
                'http://localhost:8000/api/recommend/friendrecommendation',
                { message: inputfriend },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const aiMessage = {
                id: messages.length + 2,
                content: renderRecommendations(response.data.data),
                sent: false,
                isAI: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMessage]);
            
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: messages.length + 2,
                content: "Sorry, I'm having trouble connecting. Please try again later.",
                sent: false,
                isAI: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="fixed top-0 right-0 h-full z-50 shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
        >
            <div className="flex flex-col h-full bg-white dark:bg-zinc-900 w-96">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <motion.span
                            initial={{ backgroundPosition: '0% 50%' }}
                            animate={{ backgroundPosition: '100% 50%' }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: 'mirror',
                            }}
                            className="bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 
                                    bg-clip-text text-transparent bg-[length:300%_300%]"
                        >
                            StyleGenius
                        </motion.span>
                    </h2>
                    <motion.button 
                        onClick={toggelMessager}
                        whileHover={{ scale: 1.1 }}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: message.sent ? 50 : -50 }}
                                className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-2xl max-w-[80%] relative ${
                                        message.isAI 
                                            ? 'bg-zinc-100 dark:bg-zinc-800 rounded-bl-none'
                                            : 'bg-blue-500 text-white rounded-br-none'
                                    }`}
                                >
                                    {message.isAI && (
                                        <div className="absolute -left-2 -top-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                            <FiStar className="text-white w-4 h-4" />
                                        </div>
                                    )}
                                    
                                    {typeof message.content === 'string' ? (
                                        <p className="text-sm">{message.content}</p>
                                    ) : (
                                        <div className="space-y-3">{message.content}</div>
                                    )}

                                    <div className="flex items-center justify-between mt-2">
                                        <p className={`text-xs ${
                                            message.isAI 
                                                ? 'text-zinc-500 dark:text-zinc-400' 
                                                : 'text-blue-100'
                                        }`}>
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="p-3 rounded-2xl max-w-[80%] bg-zinc-100 dark:bg-zinc-800 rounded-bl-none">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="border-t dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 sticky bottom-0">
                    <motion.div layout className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputfriend}
                            onChange={handelChangefriend}
                            placeholder="Ask StyleGenius..."
                            className="flex-1 p-2 px-4 rounded-full border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && FriendhandelOnSubmit()}
                        />
                        <motion.button
                            onClick={FriendhandelOnSubmit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                            disabled={!inputfriend.trim() || isLoading}
                        >
                            {isLoading ? (
                                <FiLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                <FiSend className="w-5 h-5" />
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}
    >
      {/* ... (keep previous header and summary sections) */}

      {/* Enhanced Accessories Section */}
      {accessories.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiWatch className="text-2xl text-amber-500" />
            Essential Accessories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessories.map((accessory, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer rounded-xl shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
                onClick={() => setExpandedAccessory(expandedAccessory === index ? null : index)}
              >
                <motion.div
                  className="p-6"
                  animate={{ height: expandedAccessory === index ? 'auto' : '160px' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{ rotate: expandedAccessory === index ? 10 : 0 }}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-purple-100'}`}
                    >
                      <FiShoppingBag className="text-2xl text-amber-500" />
                    </motion.div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {accessory.type}
                      </h4>
                      <h5 className="text-xl font-bold mt-1">{accessory.name}</h5>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedAccessory === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {accessory.description}
                        </p>
                        <div className="flex gap-2">
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            className={`px-4 py-2 rounded-full ${
                              isDarkMode 
                                ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            href={accessory.whereToBuyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Buy Now
                          </motion.a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Color Palette */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiDroplet className="text-2xl text-red-500" />
          Color Story
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
              onClick={() => copyColor(color)}
            >
              <div
                className="w-12 h-12 rounded-xl shadow-lg cursor-pointer transition-all"
                style={{ 
                  backgroundColor: color,
                  border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                }}
              />
              <AnimatePresence>
                {copiedColor === color && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 bg-black text-white px-2 py-1 rounded text-xs"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div 
          whileHover={{ rotate: 1 }}
          className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiSun className="text-2xl text-amber-500 animate-pulse" />
            Occasion Tips
          </h3>
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {data.occasionTips}
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ rotate: -1 }}
          className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiUmbrella className="text-2xl text-emerald-500 animate-bounce" />
            Weather Guide
          </h3>
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {data.weatherConsiderations}
          </p>
        </motion.div>
      </div>

      {/* Interactive Metadata */}
      {recommendation.metadata?.parameters && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-10 pt-10 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <h3 className="text-2xl font-bold mb-6">Recommendation Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(recommendation.metadata.parameters).map(([key, value], index) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg cursor-help ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <FiInfo className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {!showMessager ? (
  // Show the button to open the chat
  <div
    className="messager-div fixed bottom-8 right-8 z-50 cursor-pointer"
    onClick={toggelMessager}
  >
    <motion.div
      className="p-4 rounded-full shadow-lg bg-blue-600"
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <MessageSquare className="text-white w-6 h-6" />
    </motion.div>
  </div>
) : (
  // Show the full chat box
  <ShowChatfriend toggelMessager={toggelMessager} />
)}

    </motion.div>
  );
};

export default RecommendationDisplay;