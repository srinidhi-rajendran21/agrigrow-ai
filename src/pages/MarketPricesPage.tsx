import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, Search, ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Simulated crop database with dynamic price generation
const CROP_DATABASE = [
  { name: "Paddy", emoji: "🌾", unit: "quintal", basePrice: 2200, markets: ["Thanjavur", "Tiruvarur", "Nagapattinam", "Cuddalore"] },
  { name: "Tomato", emoji: "🍅", unit: "kg", basePrice: 25, markets: ["Coimbatore", "Madurai", "Erode", "Salem"] },
  { name: "Onion", emoji: "🧅", unit: "kg", basePrice: 18, markets: ["Madurai", "Trichy", "Dindigul", "Karur"] },
  { name: "Coconut", emoji: "🥥", unit: "piece", basePrice: 35, markets: ["Salem", "Pollachi", "Coimbatore", "Tirupur"] },
  { name: "Turmeric", emoji: "🟡", unit: "kg", basePrice: 145, markets: ["Erode", "Salem", "Namakkal", "Karur"] },
  { name: "Chilli", emoji: "🌶️", unit: "kg", basePrice: 120, markets: ["Guntur", "Ramanathapuram", "Virudhunagar", "Sivaganga"] },
  { name: "Mango", emoji: "🥭", unit: "kg", basePrice: 80, markets: ["Krishnagiri", "Dharmapuri", "Salem", "Vellore"] },
  { name: "Banana", emoji: "🍌", unit: "dozen", basePrice: 60, markets: ["Trichy", "Theni", "Dindigul", "Madurai"] },
  { name: "Sugarcane", emoji: "🎋", unit: "tonne", basePrice: 3200, markets: ["Villupuram", "Cuddalore", "Erode", "Coimbatore"] },
  { name: "Cotton", emoji: "☁️", unit: "quintal", basePrice: 6500, markets: ["Ramanathapuram", "Virudhunagar", "Tirupur", "Coimbatore"] },
  { name: "Maize", emoji: "🌽", unit: "quintal", basePrice: 2100, markets: ["Perambalur", "Ariyalur", "Salem", "Namakkal"] },
  { name: "Groundnut", emoji: "🥜", unit: "kg", basePrice: 95, markets: ["Villupuram", "Tiruvannamalai", "Cuddalore", "Vellore"] },
  { name: "Jasmine", emoji: "🌸", unit: "kg", basePrice: 800, markets: ["Madurai", "Dindigul", "Trichy", "Thoothukudi"] },
  { name: "Tapioca", emoji: "🟤", unit: "kg", basePrice: 12, markets: ["Salem", "Namakkal", "Dharmapuri", "Krishnagiri"] },
  { name: "Black Gram", emoji: "⚫", unit: "kg", basePrice: 85, markets: ["Villupuram", "Cuddalore", "Tiruvannamalai", "Vellore"] },
  { name: "Green Gram", emoji: "🟢", unit: "kg", basePrice: 78, markets: ["Thanjavur", "Nagapattinam", "Tiruvarur", "Pudukkottai"] },
  { name: "Drumstick", emoji: "🥒", unit: "kg", basePrice: 45, markets: ["Madurai", "Theni", "Dindigul", "Virudhunagar"] },
  { name: "Brinjal", emoji: "🍆", unit: "kg", basePrice: 22, markets: ["Coimbatore", "Tirupur", "Erode", "Salem"] },
  { name: "Ladies Finger", emoji: "🫛", unit: "kg", basePrice: 30, markets: ["Trichy", "Karur", "Perambalur", "Ariyalur"] },
  { name: "Coriander", emoji: "🌿", unit: "kg", basePrice: 110, markets: ["Madurai", "Dindigul", "Theni", "Sivaganga"] },
];

const ALL_MANDIS = [
  "All Mandis", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Thanjavur",
  "Karur", "Dindigul", "Tirupur", "Vellore", "Villupuram", "Cuddalore",
  "Krishnagiri", "Dharmapuri", "Namakkal", "Pollachi", "Theni",
];

// Seeded random for consistency within a session
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateSparkline = (base: number, seed: number) => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i,
    price: Math.round(base * (0.9 + seededRandom(seed + i) * 0.2)),
  }));
};

const generateMarketPrices = (crop: typeof CROP_DATABASE[0], dateSeed: number) => {
  return crop.markets.map((market, mi) => {
    const variation = seededRandom(dateSeed + mi + crop.name.charCodeAt(0));
    const price = Math.round(crop.basePrice * (0.85 + variation * 0.3));
    const yesterdayPrice = Math.round(price * (0.95 + seededRandom(dateSeed + mi + 99) * 0.1));
    const change = price - yesterdayPrice;
    const changePct = ((change / yesterdayPrice) * 100).toFixed(1);
    return {
      market,
      price,
      yesterdayPrice,
      change,
      changePct,
      trend: change >= 0 ? "up" as const : "down" as const,
    };
  });
};

const MarketPricesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedMandi, setSelectedMandi] = useState("All Mandis");
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dateSeed = Math.floor(Date.now() / 86400000); // changes daily

  const filtered = useMemo(() => {
    let crops = CROP_DATABASE;
    if (search.trim()) {
      crops = crops.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.emoji.includes(search)
      );
    }
    if (selectedMandi !== "All Mandis") {
      crops = crops.filter(c => c.markets.includes(selectedMandi));
    }
    return crops;
  }, [search, selectedMandi]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setSelectedCrop(null);
    if (val.length > 0) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 600);
    }
  };

  const selectedCropData = useMemo(() => {
    if (!selectedCrop) return null;
    const crop = CROP_DATABASE.find(c => c.name === selectedCrop);
    if (!crop) return null;
    const marketPrices = generateMarketPrices(crop, dateSeed);
    const bestMarket = marketPrices.reduce((a, b) => a.price > b.price ? a : b);
    const sparkline = generateSparkline(crop.basePrice, dateSeed + crop.name.charCodeAt(0));
    return { crop, marketPrices, bestMarket, sparkline };
  }, [selectedCrop, dateSeed]);

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-water text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            Market Prices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search any crop · {CROP_DATABASE.length} crops · {ALL_MANDIS.length - 1} mandis across Tamil Nadu
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search any crop... (Paddy, Turmeric, Jasmine, Maize...)"
              className="w-full rounded-2xl border border-input bg-background/80 backdrop-blur-sm pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          {/* Mandi filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {ALL_MANDIS.slice(0, 8).map((m) => (
              <button
                key={m}
                onClick={() => { setSelectedMandi(m); setSelectedCrop(null); }}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedMandi === m
                    ? "gradient-hero text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-elevated p-4 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crop Grid */}
        {!isSearching && !selectedCrop && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((crop, i) => {
              const marketPrices = generateMarketPrices(crop, dateSeed);
              const bestPrice = Math.max(...marketPrices.map(m => m.price));
              const avgChange = marketPrices.reduce((s, m) => s + m.change, 0) / marketPrices.length;
              const sparkline = generateSparkline(crop.basePrice, dateSeed + crop.name.charCodeAt(0));

              return (
                <motion.div
                  key={crop.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * Math.min(i, 12) }}
                  onClick={() => setSelectedCrop(crop.name)}
                  className="glass-elevated p-4 cursor-pointer group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{crop.emoji}</span>
                    <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      avgChange >= 0 ? "bg-accent text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {avgChange >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(0)}
                    </div>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground">{crop.name}</h3>
                  <p className="font-heading text-lg font-black text-foreground mt-0.5">₹{bestPrice}</p>
                  <p className="text-[10px] text-muted-foreground">per {crop.unit}</p>
                  {/* Sparkline */}
                  <div className="mt-2 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkline}>
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={avgChange >= 0 ? "hsl(145, 58%, 32%)" : "hsl(0, 72%, 51%)"}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {!isSearching && !selectedCrop && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-heading font-bold text-foreground">No crops found</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for "Paddy", "Turmeric", or "Jasmine"</p>
          </motion.div>
        )}

        {/* Crop Detail View */}
        <AnimatePresence>
          {selectedCropData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Back button */}
              <button
                onClick={() => setSelectedCrop(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                ← Back to all crops
              </button>

              {/* Crop header */}
              <div className="glass-elevated p-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedCropData.crop.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-black text-foreground">{selectedCropData.crop.name}</h2>
                    <p className="text-sm text-muted-foreground">per {selectedCropData.crop.unit} · Updated today</p>
                  </div>
                </div>

                {/* Best Market Recommendation */}
                <div className="mt-4 rounded-2xl bg-accent/50 border border-primary/20 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Best Market to Sell</span>
                  </div>
                  <p className="font-heading text-lg font-black text-foreground">
                    {selectedCropData.bestMarket.market} — ₹{selectedCropData.bestMarket.price}/{selectedCropData.crop.unit}
                  </p>
                </div>

                {/* Price Prediction Sparkline */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">7-Day Price Trend</span>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedCropData.sparkline}>
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(145, 58%, 32%)"
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: "hsl(145, 58%, 32%)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Market comparison */}
              <div className="space-y-2">
                <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Mandi-wise Comparison
                </h3>
                {selectedCropData.marketPrices.map((mp, i) => (
                  <motion.div
                    key={mp.market}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-elevated p-4 flex items-center justify-between ${
                      mp.market === selectedCropData.bestMarket.market ? "ring-2 ring-primary/30" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-foreground">{mp.market}</span>
                        {mp.market === selectedCropData.bestMarket.market && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">BEST</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Yesterday: ₹{mp.yesterdayPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-xl font-black text-foreground">₹{mp.price}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs font-bold ${
                        mp.trend === "up" ? "text-primary" : "text-destructive"
                      }`}>
                        {mp.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {mp.changePct}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Ask AI button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate(`/chat?topic=price&crop=${encodeURIComponent(selectedCropData.crop.name)}`)}
                className="w-full rounded-2xl gradient-hero py-4 text-sm font-bold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI for Price Prediction & Selling Strategy
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-muted/50 border border-border p-4 text-center text-xs text-muted-foreground"
        >
          ⚠️ Prices are AI-simulated for demonstration. Consult local AO for actual mandi rates.
        </motion.div>
      </div>
    </div>
  );
};

export default MarketPricesPage;
