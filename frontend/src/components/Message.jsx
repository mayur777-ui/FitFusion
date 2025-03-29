import { motion } from "framer-motion";

const Message = ({ sender, content }) => {
    return (
      <motion.div
        className={`${sender === "bot" ? "pr-16" : "pl-16"} group`}
        whileHover={{ scale: 1.01 }}
      >
        <div className={`relative p-4 rounded-xl shadow-lg ${
          sender === "bot" 
            ? "bg-gray-800/60 rounded-tl-none" 
            : "bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 rounded-tr-none"
        }`}>
          {/* Chat triangle indicator */}
          {sender === "bot" ? (
            <div className="absolute -left-2 top-0 w-4 h-4 clip-triangle-left bg-gray-800/60" />
          ) : (
            <div className="absolute -right-2 top-0 w-4 h-4 clip-triangle-right bg-emerald-500/15" />
          )}
          
          {content}
        </div>
      </motion.div>
    );
  };
  


export default Message;