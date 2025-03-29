import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiRefreshCw, FiAlertCircle, FiSun, FiDroplet, FiCalendar } from "react-icons/fi";
import Message from "./Message";

const ChatBot = () => {
  // ... [previous state and ref declarations]
  const [messages, setMessages] = useState([
    { 
      text: "👋 Welcome to StyleGenius! Describe your needs like 'Sunny Beach Wedding' or 'Cold Formal Dinner'", 
      sender: "bot" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);
  const processRecommendation = (recommendation) => {
    const { topwear, bottomwear, footwear, accessories, style_reason, weather, occasion } = recommendation;
    
    return (
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Weather/Occasion Badge */}
        <div className="flex gap-3 items-center text-sm font-medium text-emerald-300">
          <div className="flex items-center gap-1 bg-gray-800/50 px-3 py-1 rounded-full">
            <FiSun className="text-amber-400" />
            <span>{weather}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800/50 px-3 py-1 rounded-full">
            <FiCalendar className="text-purple-400" />
            <span>{occasion}</span>
          </div>
        </div>

        {/* Outfit Grid */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                👕
              </div>
              <h3 className="font-semibold">Topwear</h3>
            </div>
            <p className="text-gray-300">{topwear}</p>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                👖
              </div>
              <h3 className="font-semibold">Bottomwear</h3>
            </div>
            <p className="text-gray-300">{bottomwear}</p>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                👟
              </div>
              <h3 className="font-semibold">Footwear</h3>
            </div>
            <p className="text-gray-300">{footwear}</p>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                💎
              </div>
              <h3 className="font-semibold">Accessories</h3>
            </div>
            <p className="text-gray-300">{accessories}</p>
          </div>
        </div>

        {/* Style Reason */}
        <div className="p-4 bg-gray-800/30 rounded-xl border border-emerald-500/20">
          <div className="flex gap-2 items-center text-emerald-400 mb-2">
            <FiDroplet className="flex-shrink-0" />
            <span className="font-medium">Style Rationale</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{style_reason}</p>
        </div>
      </motion.div>
    );
  };

  // ... [rest of the component remains similar but with updated JSX below]
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const [weather, ...occasionParts] = input.trim().split(" ");
      const occasion = occasionParts.join(" ");

      if (!weather || !occasion) {
        throw new Error("Please provide both weather and occasion");
      }

      const response = await axios.post("http://localhost:5000/recommend", { 
        weather, 
        occasion 
      });

      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          content: processRecommendation(response.data.recommendation),
          recommendation: response.data.recommendation
        }
      ]);

    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        content: (
          <div className="flex items-center gap-2 text-red-400">
            <FiAlertCircle />
            {err.response?.data?.error || "Failed to generate recommendation"}
          </div>
        )
      }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };
  return (
    <motion.div
      className="relative h-[700px] w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            👗
          </div>
          <div>
            <h1 className="font-semibold">StyleGenius AI</h1>
            <p className="text-sm text-gray-400">Personal Fashion Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="h-[calc(100%-160px)] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: msg.sender === "bot" ? -20 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="mb-4 last:mb-0"
            >
              <Message 
                sender={msg.sender}
                content={msg.content || msg.text}
              />
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 text-gray-400 bg-gray-800/30 rounded-xl"
            >
              <FiRefreshCw className="animate-spin flex-shrink-0" />
              <div>
                <p className="font-medium">Analyzing your request</p>
                <p className="text-sm text-gray-500 mt-1">Searching through latest fashion trends...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <motion.div 
          className="relative"
          animate={error ? "error" : "normal"}
          variants={{
            normal: { y: 0 },
            error: { y: -10 }
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Describe your needs → e.g. 'Misty Mountain Hike Casual'"
            className="w-full pr-14 pl-5 py-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-gray-500 text-sm font-medium"
            disabled={loading}
          />
          
          <motion.button
            onClick={sendMessage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-2 p-2 bg-emerald-500/90 hover:bg-emerald-400 rounded-lg backdrop-blur-sm transition-colors"
            disabled={loading}
            style={{ transformOrigin: "center" }}
          >
            <FiSend className="text-white text-lg" />
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            <FiAlertCircle className="flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBot;