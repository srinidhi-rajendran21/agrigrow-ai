import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Camera, Mic, MicOff, Loader2 } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import LanguageToggle from "@/components/LanguageToggle";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import { streamChat, type ChatMsg } from "@/lib/streamChat";
import { toast } from "sonner";

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    role: "assistant",
    content:
      "Vanakkam! 🌾 Naan unga **AgriGrow AI Assistant**. Enna help venum?\n\n- 🌱 **Crop suggestions** — un soil & season ku best crop\n- 🦠 **Plant Clinic** — disease detect panrom\n- 💰 **Govt Schemes** — subsidies & programs\n- 🌦️ **Weather advice** — irrigation & fertilizer timing\n- 📈 **Market prices** — best selling strategy\n- 🏪 **Direct selling** — middlemen illama sell pannu\n\nKelu bro, naan ready! 💪",
  },
];

const SUGGESTED_EN = [
  "Best crop for red soil this season?",
  "Tell me about PM-KISAN scheme",
  "How to prevent leaf curl disease?",
  "What's the tomato price in Coimbatore?",
];

const SUGGESTED_TA = [
  "சிவப்பு மண்ணில் என்ன பயிர் நடலாம்?",
  "PM-KISAN திட்டம் பற்றி சொல்லுங்கள்",
  "இலை சுருள் நோயை எப்படி தடுப்பது?",
  "கோயம்புத்தூரில் தக்காளி விலை என்ன?",
];

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (text?: string) => {
      const msgText = (text || input).trim();
      if (!msgText || isLoading) return;

      const userMsg: ChatMsg = { role: "user", content: msgText };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);
      setShowSuggestions(false);

      abortRef.current = new AbortController();
      let assistantSoFar = "";

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        await streamChat({
          messages: newMessages,
          language,
          onDelta: upsertAssistant,
          onDone: () => {
            setIsLoading(false);
            setShowSuggestions(true);
          },
          onError: (err) => {
            setIsLoading(false);
            toast.error(err);
          },
          signal: abortRef.current.signal,
        });
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setIsLoading(false);
          toast.error("Connection failed. Please try again.");
        }
      }
    },
    [input, messages, isLoading, language]
  );

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in your browser.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not capture voice. Please try again.");
    };
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const suggested = language === "ta" ? SUGGESTED_TA : SUGGESTED_EN;

  return (
    <div className="flex h-screen flex-col md:pt-14 pb-16">
      {/* Chat header */}
      <div className="shrink-0 border-b border-border bg-card/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">AgriGrow AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] text-muted-foreground">Thanglish · Always ready</p>
            </div>
          </div>
        </div>
        <LanguageToggle language={language} onToggle={setLanguage} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} language={language} />
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}

        {showSuggestions && !isLoading && (
          <SuggestedQuestions questions={suggested} onSelect={(q) => handleSend(q)} />
        )}

        <p className="text-center text-[10px] text-muted-foreground/50 pt-2">
          ⚠️ AI-generated advice. Consult local AO (Agricultural Officer) for critical steps.
        </p>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-xl px-3 md:px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <motion.button
            onClick={handleVoiceInput}
            animate={isListening ? { scale: [1, 1.15, 1] } : {}}
            transition={isListening ? { duration: 1, repeat: Infinity } : {}}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
              isListening
                ? "gradient-hero text-primary-foreground glow-primary"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </motion.button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={language === "ta" ? "உங்கள் கேள்வியை கேளுங்கள்..." : "Ask about crops, diseases, schemes..."}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl gradient-hero text-primary-foreground disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
