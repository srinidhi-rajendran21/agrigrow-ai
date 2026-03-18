import { motion } from "framer-motion";
import { Bookmark, Clock, Lightbulb } from "lucide-react";
import WeatherCard from "@/components/WeatherCard";

const tips = [
  { emoji: "💧", text: "Water paddy fields early morning for best absorption" },
  { emoji: "🌿", text: "Neem oil spray every 15 days prevents most pests" },
  { emoji: "🧪", text: "Test soil pH before planting — ideal range is 6.0-7.0" },
  { emoji: "🌾", text: "Rotate crops each season to maintain soil health" },
];

const recentQueries = [
  { q: "Best crop for red soil in Tamil Nadu?", time: "2h ago" },
  { q: "How to treat yellow leaf curl?", time: "5h ago" },
  { q: "PM-KISAN eligibility check", time: "1d ago" },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl font-extrabold text-foreground"
        >
          Dashboard
        </motion.h1>

        <WeatherCard />

        {/* Farming Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-elevated p-6"
        >
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-4">
            <Lightbulb className="h-5 w-5 text-sun" />
            Farming Tips
          </h3>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3 rounded-xl bg-muted p-3"
              >
                <span className="text-xl">{tip.emoji}</span>
                <p className="text-sm text-foreground">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-elevated p-6"
        >
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {recentQueries.map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-muted p-3">
                <p className="text-sm text-foreground">{q.q}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{q.time}</span>
                  <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
