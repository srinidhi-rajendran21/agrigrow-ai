import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Camera, Mic, Paperclip } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";

type Message = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Vanakkam! 🌾 I'm your Farmer AI Assistant. Ask me about crops, diseases, weather tips, or government schemes. How can I help you today?",
  },
];

const DEMO_RESPONSES: Record<string, string> = {
  crop: "Based on your region and current season, I recommend planting **paddy (rice)** or **groundnut**. Paddy thrives in the current humidity, while groundnut is ideal for well-drained soils. Would you like detailed planting guides?",
  disease: "I can help identify plant diseases! Please upload a photo of the affected plant using the camera button, and I'll analyze it for you.",
  scheme: "Here are some key government schemes for farmers:\n\n🏛️ **PM-KISAN** — ₹6,000/year direct income support\n🌾 **PM Fasal Bima Yojana** — Crop insurance at low premiums\n💧 **PM Krishi Sinchayee Yojana** — Irrigation support\n\nWould you like details on any specific scheme?",
  default: "That's a great question! In a full setup, I'd use AI with agricultural knowledge to give you a detailed answer. For now, try asking about crop suggestions, disease detection, or government schemes!",
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("crop") || lower.includes("suggest") || lower.includes("plant")) return DEMO_RESPONSES.crop;
    if (lower.includes("disease") || lower.includes("leaf") || lower.includes("yellow")) return DEMO_RESPONSES.disease;
    if (lower.includes("scheme") || lower.includes("govt") || lower.includes("subsid")) return DEMO_RESPONSES.scheme;
    return DEMO_RESPONSES.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(userMsg.content) }]);
    }, 1200);
  };

  return (
    <div className="flex h-screen flex-col md:pt-16 pb-20">
      {/* Chat header */}
      <div className="shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-4 py-3">
        <h2 className="font-heading text-lg font-bold text-foreground">🌾 Farm Assistant</h2>
        <p className="text-xs text-muted-foreground">Ask me anything about farming</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-card/90 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/80">
            <Camera className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/80">
            <Mic className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about crops, diseases, schemes..."
              className="w-full rounded-full border border-input bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full gradient-hero text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
