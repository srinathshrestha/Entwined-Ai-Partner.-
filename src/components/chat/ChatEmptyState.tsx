import { motion } from "framer-motion";
import { MessageCircle, Heart, Sparkles, ArrowRight } from "lucide-react";

interface ChatEmptyStateProps {
  companionName?: string;
  onStartConversation?: (message: string) => void;
}

export default function ChatEmptyState({ companionName = "your companion", onStartConversation }: ChatEmptyStateProps) {
  const suggestions = [
    "How are you feeling today?",
    "Tell me about your day",
    "What's on your mind?",
    "I'd love to hear about you",
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md space-y-8"
      >
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mx-auto w-24 h-24"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Start a conversation with {companionName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Your AI companion is ready to listen, chat, and build memories with you. 
            Every conversation helps strengthen your unique connection.
          </p>
        </motion.div>

        {/* Conversation Starters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            Conversation starters
          </p>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartConversation?.(suggestion)}
                className="group flex items-center justify-between p-3 text-left text-sm bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  &ldquo;{suggestion}&rdquo;
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all duration-200" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          {[
            { icon: "💭", label: "Thoughtful", desc: "Deep conversations" },
            { icon: "🧠", label: "Memory", desc: "Remembers you" },
            { icon: "❤️", label: "Caring", desc: "Always supportive" },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
              className="text-center space-y-2"
            >
              <div className="text-2xl">{feature.icon}</div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {feature.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
