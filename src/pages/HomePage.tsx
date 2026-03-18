import { motion } from "framer-motion";
import { Leaf, MessageCircle, Landmark, Sprout } from "lucide-react";
import ActionCard from "@/components/ActionCard";
import heroFarm from "@/assets/hero-farm.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen pb-24 md:pt-20">
      {/* Hero */}
      <div className="relative h-[320px] md:h-[400px] overflow-hidden">
        <img
          src={heroFarm}
          alt="Lush green farmland at sunrise"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-background" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl drop-shadow-lg"
          >
            Farmer AI Assistant 🌾
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-md text-primary-foreground/90 text-lg drop-shadow"
          >
            Smart farming guidance powered by AI — in English & Tamil
          </motion.p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-auto max-w-3xl px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            icon={Sprout}
            title="Crop Suggestion"
            description="Get the best crop for your soil & season"
            to="/chat?topic=crop"
            gradient="gradient-hero"
            delay={0.1}
          />
          <ActionCard
            icon={Leaf}
            title="Disease Detection"
            description="Upload a photo to identify plant diseases"
            to="/detect"
            gradient="gradient-sun"
            delay={0.2}
          />
          <ActionCard
            icon={Landmark}
            title="Govt Schemes"
            description="Find government subsidies & programs"
            to="/chat?topic=schemes"
            gradient="gradient-sky"
            delay={0.3}
          />
          <ActionCard
            icon={MessageCircle}
            title="Ask AI"
            description="Chat with your farming assistant"
            to="/chat"
            gradient="gradient-hero"
            delay={0.4}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mx-auto mt-8 max-w-3xl px-4"
      >
        <div className="rounded-xl bg-sun-light p-4 text-center text-sm text-muted-foreground">
          ⚠️ This is AI-based guidance. For critical issues, consult agricultural experts.
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
