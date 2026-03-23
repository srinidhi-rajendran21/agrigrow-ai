import { motion } from "framer-motion";
import { Leaf, MessageCircle, Landmark, Sprout, TrendingUp, ShieldCheck, Wifi } from "lucide-react";
import ActionCard from "@/components/ActionCard";

const stats = [
  { value: "50+", label: "Crops", emoji: "🌾" },
  { value: "100+", label: "Diseases", emoji: "🔬" },
  { value: "2", label: "Languages", emoji: "🌐" },
  { value: "24/7", label: "Available", emoji: "⏰" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen pb-24 md:pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-hero-vivid px-6 py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-primary-foreground/5" />
          <div className="absolute left-1/2 top-10 h-32 w-32 rounded-full bg-primary-foreground/3" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm"
          >
            <span className="text-4xl animate-float">🌾</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl font-black text-primary-foreground md:text-5xl leading-tight"
          >
            AgriGrow AI
            <br />
            Farm Assistant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 max-w-lg mx-auto text-primary-foreground/85 text-base md:text-lg leading-relaxed"
          >
            Smart, personalized farming guidance in English & Tamil — crop advice, disease detection, market prices & more
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <a
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-3.5 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Start Chatting
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-auto max-w-3xl px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-elevated grid grid-cols-4 divide-x divide-border py-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="font-heading text-lg font-black text-foreground">{s.value}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mx-auto max-w-3xl px-4 mt-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2"
        >
          <span className="h-1 w-6 rounded-full gradient-hero inline-block" />
          Quick Actions
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            icon={Sprout}
            title="Crop Suggestion"
            description="Best crop for your soil & season"
            to="/chat?topic=crop"
            gradient="gradient-hero"
            emoji="🌱"
            delay={0.1}
          />
          <ActionCard
            icon={Leaf}
            title="Disease Detection"
            description="Upload a photo to identify diseases"
            to="/detect"
            gradient="gradient-sun"
            emoji="🦠"
            delay={0.15}
          />
          <ActionCard
            icon={TrendingUp}
            title="Market Prices"
            description="Real-time mandi prices & trends"
            to="/prices"
            gradient="gradient-water"
            emoji="📈"
            delay={0.2}
          />
          <ActionCard
            icon={Landmark}
            title="Govt Schemes"
            description="Subsidies & program benefits"
            to="/schemes"
            gradient="gradient-sky"
            emoji="🏛️"
            delay={0.25}
          />
          <ActionCard
            icon={ShieldCheck}
            title="Direct Selling"
            description="Sell without middlemen on eNAM, ONDC"
            to="/chat?topic=selling"
            gradient="gradient-earth"
            emoji="🏪"
            delay={0.3}
          />
          <ActionCard
            icon={MessageCircle}
            title="Ask AI Anything"
            description="Chat with your farming assistant"
            to="/chat"
            gradient="gradient-hero"
            emoji="💬"
            delay={0.35}
          />
        </div>
      </div>

      {/* Safety Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mx-auto mt-8 max-w-3xl px-4"
      >
        <div className="rounded-2xl bg-sun-light border border-secondary/20 p-4 text-center text-sm text-muted-foreground">
          ⚠️ AI-based guidance. For critical decisions, consult your local agricultural officer.
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
