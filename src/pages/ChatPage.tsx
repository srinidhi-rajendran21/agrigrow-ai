import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
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
      "Vanakkam! 🌾 I'm your **Farmer AI Assistant**. I can help you with:\n\n- 🌱 **Crop suggestions** based on your soil & season\n- 🦠 **Disease detection** from plant photos\n- 💰 **Government schemes** & subsidies\n- 🌦️ **Weather-based** farming advice\n- 📈 **Market prices** & selling tips\n\nHow can I help you today?",
  },
];

const SUGGESTED_EN = [
  "Best crop for red soil this season?",
  "Tell me about PM-KISAN scheme",
  "How to prevent leaf curl disease?",
  "Weather tips for paddy farming",
];

const SUGGESTED_TA = [
  "சிவப்பு மண்ணில் என்ன பயிர் நடலாம்?",
  "PM-KISAN திட்டம் பற்றி சொல்லுங்கள்",
  "இலை சுருள் நோயை எப்படி தடுப்பது?",
  "நெல் சாகுபடிக்கான வானிலை குறிப்புகள்",
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
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
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
    <div className="flex h-screen flex-col md:pt-16 pb-20">
      {/* Chat header */}
      <div className="shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">🌾 Farm Assistant</h2>
          <p className="text-xs text-muted-foreground">AI-powered farming guidance</p>
        </div>
        <LanguageToggle language={language} onToggle={setLanguage} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} language={language} />
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}

        {/* Suggested questions */}
        {showSuggestions && !isLoading && (
          <SuggestedQuestions questions={suggested} onSelect={(q) => handleSend(q)} />
        )}

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-muted-foreground/60 pt-2">
          ⚠️ AI-based guidance. Consult agricultural experts for critical decisions.
        </p>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-card/90 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            onClick={handleVoiceInput}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              isListening
                ? "gradient-hero text-primary-foreground animate-pulse"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={language === "ta" ? "உங்கள் கேள்வியை கேளுங்கள்..." : "Ask about crops, diseases, schemes..."}
              className="w-full rounded-full border border-input bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full gradient-hero text-primary-foreground disabled:opacity-40 transition-opacity"
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
