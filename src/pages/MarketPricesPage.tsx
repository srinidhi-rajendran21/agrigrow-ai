import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_PRICES = [
  { crop: "🍅 Tomato", price: 25, unit: "kg", market: "Coimbatore", trend: "up" as const, change: "+₹3" },
  { crop: "🧅 Onion", price: 18, unit: "kg", market: "Madurai", trend: "down" as const, change: "-₹2" },
  { crop: "🌾 Paddy", price: 2200, unit: "quintal", market: "Thanjavur", trend: "up" as const, change: "+₹50" },
  { crop: "🥥 Coconut", price: 35, unit: "piece", market: "Salem", trend: "up" as const, change: "+₹5" },
  { crop: "🌶️ Chilli", price: 120, unit: "kg", market: "Guntur", trend: "down" as const, change: "-₹10" },
  { crop: "🥭 Mango", price: 80, unit: "kg", market: "Krishnagiri", trend: "up" as const, change: "+₹8" },
];

const MarketPricesPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = MOCK_PRICES.filter((p) => p.crop.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-water text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            Market Prices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time mandi prices across Tamil Nadu</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops..."
              className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </motion.div>

        {/* Price cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="glass-elevated p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/chat?topic=price&crop=${encodeURIComponent(item.crop)}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">{item.crop}</h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.market}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl font-black text-foreground">₹{item.price}</p>
                  <p className="text-xs text-muted-foreground">per {item.unit}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.trend === "up" ? "bg-accent text-primary" : "bg-destructive/10 text-destructive"
                }`}>
                  {item.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                  Ask AI <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-sun-light border border-secondary/20 p-4 text-center text-sm text-muted-foreground"
        >
          💡 Tap any crop to ask the AI for price predictions and best selling strategies
        </motion.div>
      </div>
    </div>
  );
};

export default MarketPricesPage;
