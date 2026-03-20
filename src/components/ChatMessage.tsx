import { motion } from "framer-motion";
import { Bot, User, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  language?: string;
}

const ChatMessage = ({ role, content, language = "en" }: ChatMessageProps) => {
  const isUser = role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = language === "ta" ? "ta-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isUser ? "gradient-hero" : "bg-accent"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-accent-foreground" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "gradient-hero text-primary-foreground rounded-tr-sm"
            : "glass-card text-foreground rounded-tl-sm"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <div className="prose prose-sm prose-green dark:prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_strong]:text-primary">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {!isUser && content.length > 10 && (
          <button
            onClick={handleSpeak}
            className={`mt-2 flex items-center gap-1 text-xs transition-colors ${
              isSpeaking ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            {isSpeaking ? "Stop" : "Listen"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
